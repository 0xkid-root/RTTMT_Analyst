'use client';

import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { RiskLocation } from '../types/command-center-types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RiskMapProps {
  locations: RiskLocation[];
  className?: string;
}

const getMarkerColor = (level: string) => {
  switch (level) {
    case 'CRITICAL': return '#ef4444'; 
    case 'HIGH': return '#f97316'; 
    case 'MEDIUM': return '#eab308'; 
    default: return '#22c55e'; 
  }
};

export function RiskMap({ locations, className = "w-full h-full min-h-[500px]" }: RiskMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const INDIA_CENTER: [number, number] = [78.9629, 20.5937];

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: INDIA_CENTER,
      zoom: 3.8,
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const filteredLocations = locations.filter(loc => {
      if (filter === 'ALL') return true;
      if (filter === 'HIGH') return loc.riskLevel === 'HIGH' || loc.riskLevel === 'CRITICAL';
      if (filter === 'MEDIUM') return loc.riskLevel === 'MEDIUM';
      if (filter === 'LOW') return loc.riskLevel === 'LOW';
      return true;
    });

    filteredLocations.forEach(loc => {
      const el = document.createElement('div');
      
      const isHighRisk = loc.riskLevel === 'CRITICAL' || loc.riskLevel === 'HIGH';
      
      el.className = cn(
        'w-4 h-4 rounded-full border-2 border-background cursor-pointer transition-transform hover:scale-125 relative',
        isHighRisk ? 'shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'shadow-md'
      );
      
      el.style.backgroundColor = getMarkerColor(loc.riskLevel);

      if (isHighRisk) {
        const pulse = document.createElement('div');
        pulse.className = 'absolute -inset-2 rounded-full border border-danger/50 animate-ping';
        el.appendChild(pulse);
      }

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 bg-background border border-border rounded-lg shadow-lg min-w-[200px] text-foreground font-sans';
      
      popupContent.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-bold text-sm">${loc.city}</h4>
          <span class="text-[10px] px-1.5 py-0.5 rounded font-bold ${
            loc.riskLevel === 'CRITICAL' ? 'bg-danger/10 text-danger' :
            loc.riskLevel === 'HIGH' ? 'bg-warning/10 text-warning' :
            loc.riskLevel === 'MEDIUM' ? 'bg-warning/10 text-warning' :
            'bg-success/10 text-success'
          }">${loc.riskLevel}</span>
        </div>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Transactions</span>
            <span class="font-medium">${loc.transactions.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Alerts</span>
            <span class="font-medium">${loc.alerts.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Cases</span>
            <span class="font-medium">${loc.cases.toLocaleString()}</span>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 15, closeButton: false, className: 'rtmt-popup' })
        .setDOMContent(popupContent);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([loc.longitude, loc.latitude])
        .setPopup(popup)
        .addTo(map.current!);
        
      markersRef.current.push(marker);
    });

  }, [locations, filter]);

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden h-full flex flex-col relative">
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
        
        <div className="bg-background/90 backdrop-blur-sm border border-border px-3 py-2 rounded-md text-sm font-semibold shadow-sm pointer-events-auto">
          Transaction Risk Map
        </div>
        
        <div className="flex bg-background/90 backdrop-blur-sm border border-border rounded-md p-1 pointer-events-auto text-xs font-medium shadow-sm">
          <button 
            onClick={() => setFilter('ALL')}
            className={cn("px-3 py-1 rounded-sm transition-colors", filter === 'ALL' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
          >All</button>
          <button 
            onClick={() => setFilter('HIGH')}
            className={cn("px-3 py-1 rounded-sm transition-colors flex items-center gap-1.5", filter === 'HIGH' ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <div className="w-2 h-2 rounded-full bg-danger"></div> High
          </button>
          <button 
            onClick={() => setFilter('MEDIUM')}
            className={cn("px-3 py-1 rounded-sm transition-colors flex items-center gap-1.5", filter === 'MEDIUM' ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <div className="w-2 h-2 rounded-full bg-warning"></div> Medium
          </button>
          <button 
            onClick={() => setFilter('LOW')}
            className={cn("px-3 py-1 rounded-sm transition-colors flex items-center gap-1.5", filter === 'LOW' ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <div className="w-2 h-2 rounded-full bg-success"></div> Low
          </button>
        </div>

      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-background/90 backdrop-blur-sm border border-border p-3 rounded-md shadow-sm pointer-events-auto">
        <div className="space-y-2 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-danger"></div> Critical</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> High</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning"></div> Medium</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-success"></div> Low</div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .rtmt-popup .maplibregl-popup-content {
          background: transparent;
          padding: 0;
          border-radius: 0.5rem;
          box-shadow: none;
        }
        .rtmt-popup .maplibregl-popup-tip {
          border-top-color: hsl(var(--border));
        }
      `}} />
      
      <div ref={mapContainer} className={className} />
    </div>
  );
}
