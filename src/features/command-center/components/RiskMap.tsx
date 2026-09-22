'use client';

import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import type { RiskLocation } from '../types/command-center-types';
import { createRoot } from 'react-dom/client';
import { X } from 'lucide-react';

interface RiskMapProps {
  locations: RiskLocation[];
  className?: string;
}

const getMarkerColor = (level: string) => {
  switch (level) {
    case 'CRITICAL': return '#ef4444'; // text-danger
    case 'HIGH': return '#f87171'; // lighter red
    case 'MEDIUM': return '#f59e0b'; // text-warning
    default: return '#737373'; // subtle
  }
};

export function RiskMap({ locations, className = "w-full h-full min-h-[400px]" }: RiskMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { resolvedTheme } = useTheme();

  // India center
  const INDIA_CENTER: [number, number] = [78.9629, 20.5937];

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: INDIA_CENTER,
      zoom: 3.5,
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    locations.forEach(loc => {
      // Create custom marker DOM element
      const el = document.createElement('div');
      el.className = 'w-4 h-4 rounded-full border-2 border-background shadow-md cursor-pointer transition-transform hover:scale-125';
      el.style.backgroundColor = getMarkerColor(loc.riskLevel);
      
      if (loc.riskLevel === 'CRITICAL') {
        el.className += ' animate-pulse';
      }

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 bg-background border border-border rounded-lg shadow-lg min-w-[200px] text-foreground font-sans';
      
      popupContent.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-bold text-sm">${loc.city}</h4>
          <span class="text-[10px] px-1.5 py-0.5 rounded font-bold ${
            loc.riskLevel === 'CRITICAL' ? 'bg-danger/10 text-danger' :
            loc.riskLevel === 'HIGH' ? 'bg-danger/10 text-danger' :
            loc.riskLevel === 'MEDIUM' ? 'bg-warning/10 text-warning' :
            'bg-muted text-muted-foreground'
          }">${loc.riskLevel}</span>
        </div>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Transactions</span>
            <span class="font-medium">${loc.transactions.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Risk Events</span>
            <span class="font-medium">${loc.riskEvents.toLocaleString()}</span>
          </div>
        </div>
        <button class="mt-3 w-full text-xs text-primary hover:underline text-left font-medium">
          View details →
        </button>
      `;

      const popup = new maplibregl.Popup({ offset: 15, closeButton: false, className: 'rtmt-popup' })
        .setDOMContent(popupContent);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([loc.longitude, loc.latitude])
        .setPopup(popup)
        .addTo(map.current!);
        
      markersRef.current.push(marker);
    });

  }, [locations]);

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden h-full flex flex-col relative">
      <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm border border-border px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm">
        Geographic Risk Overview
      </div>
      
      {/* We inject a global style for the maplibre popup to fit our dark theme safely */}
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
