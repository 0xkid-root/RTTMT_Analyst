'use client';

import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { RiskLocation, NetworkEdge } from '../types/command-center-types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RiskMapProps {
  locations: RiskLocation[];
  edges?: NetworkEdge[];
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

export default function RiskMap({ locations, edges = [], className = "flex-1 w-full h-full min-h-[500px]" }: RiskMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [mapLoaded, setMapLoaded] = useState(false);

  const INDIA_CENTER: [number, number] = [78.9629, 20.5937];

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: INDIA_CENTER,
      zoom: 3.8,
      pitch: 35,
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.current.on('load', () => {
      console.log('MapLibre: load event fired!');
      if (!map.current) return;

      try {
        // Network Edges
        if (edges && edges.length > 0) {
          const edgeFeatures = edges.map(edge => {
            const source = locations.find(l => l.id === edge.sourceId);
            const target = locations.find(l => l.id === edge.targetId);
            if (!source || !target) return null;
            return {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [source.longitude, source.latitude],
                  [target.longitude, target.latitude]
                ]
              },
              properties: {}
            };
          }).filter(Boolean) as GeoJSON.Feature<GeoJSON.LineString>[];

          map.current.addSource('edges', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: edgeFeatures
            }
          });

          map.current.addLayer({
            id: 'edges-layer',
            type: 'line',
            source: 'edges',
            paint: {
              'line-color': '#fcd34d',
              'line-width': 1,
              'line-opacity': 0.3,
              'line-dasharray': [2, 4]
            }
          });
        }
      } catch (err) {
        console.error('Error adding edges to map', err);
      }

      setMapLoaded(true);
    });

    map.current.on('error', (e) => {
      console.error('MapLibre error:', e);
    });

    const resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        map.current.resize();
      }
    });

    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

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
      const color = getMarkerColor(loc.riskLevel);
      
      el.className = cn(
        'w-3 h-3 rounded-full border border-background cursor-pointer transition-transform hover:scale-125 relative',
        isHighRisk ? 'z-10' : 'shadow-md z-0'
      );
      
      el.style.backgroundColor = color;
      
      if (isHighRisk) {
        el.style.boxShadow = `0 0 15px ${color}`;

        const glow1 = document.createElement('div');
        glow1.className = 'absolute -inset-2 rounded-full border opacity-60';
        glow1.style.borderColor = color;
        
        const glow2 = document.createElement('div');
        glow2.className = 'absolute -inset-4 rounded-full border opacity-30 animate-pulse';
        glow2.style.borderColor = color;

        const glow3 = document.createElement('div');
        glow3.className = 'absolute -inset-6 rounded-full border opacity-10 animate-ping';
        glow3.style.borderColor = color;

        el.appendChild(glow1);
        el.appendChild(glow2);
        el.appendChild(glow3);
      } else {
        const glow1 = document.createElement('div');
        glow1.className = 'absolute -inset-1 rounded-full border opacity-40';
        glow1.style.borderColor = color;
        el.appendChild(glow1);
      }

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 bg-background border border-border rounded-lg shadow-lg min-w-[200px] text-foreground font-sans';
      
      popupContent.innerHTML = `
        <div class="flex justify-between items-start mb-3">
          <h4 class="font-bold text-sm tracking-wide text-white">${loc.city}</h4>
          <span class="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
            loc.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
            loc.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
            loc.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }">${loc.riskLevel} RISK</span>
        </div>
        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between">
            <span class="text-zinc-400">Transactions</span>
            <span class="font-medium font-mono text-zinc-100">${loc.transactions.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Alerts</span>
            <span class="font-medium font-mono text-zinc-100">${loc.alerts.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Cases</span>
            <span class="font-medium font-mono text-zinc-100">${loc.cases.toLocaleString()}</span>
          </div>
        </div>
        ${loc.riskScore || loc.maliScore ? `
        <div class="mt-3 pt-3 border-t border-zinc-700/50 space-y-1.5 text-xs">
          ${loc.riskScore ? `
          <div class="flex justify-between">
            <span class="text-zinc-400">Risk Score</span>
            <span class="font-medium font-mono ${loc.riskScore > 80 ? 'text-red-400' : loc.riskScore > 50 ? 'text-orange-400' : 'text-green-400'}">${loc.riskScore}</span>
          </div>` : ''}
          ${loc.maliScore ? `
          <div class="flex justify-between">
            <span class="text-zinc-400">MALi Score</span>
            <span class="font-medium font-mono ${loc.maliScore > 80 ? 'text-red-400' : loc.maliScore > 50 ? 'text-orange-400' : 'text-green-400'}">${loc.maliScore}</span>
          </div>` : ''}
        </div>
        ` : ''}
      `;

      const popup = new maplibregl.Popup({ offset: 15, closeButton: false, className: 'rtmt-popup' })
        .setDOMContent(popupContent);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([loc.longitude, loc.latitude])
        .setPopup(popup)
        .addTo(map.current!);
        
      markersRef.current.push(marker);
    });

  }, [locations, filter, mapLoaded]);

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
          background: rgba(9, 9, 11, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
        }
        .rtmt-popup .maplibregl-popup-tip {
          border-top-color: rgba(9, 9, 11, 0.95);
        }
        .rtmt-popup .maplibregl-popup-content > div {
          padding: 0.75rem;
        }
      `}} />
      
      <div ref={mapContainer} className={className} style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px', flex: 1 }} />
    </div>
  );
}
