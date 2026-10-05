'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RiskLocation, NetworkEdge } from '../types/command-center-types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TransactionRiskMapProps {
  className?: string;
  locations?: RiskLocation[];
  edges?: NetworkEdge[];
}

export default function TransactionRiskMap({ className = "", locations = [], edges = [] }: TransactionRiskMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    // Initialize Map
    const newMap = L.map(mapContainer.current, {
      center: [22.5, 79], // [lat, lng]
      zoom: 4.2,
      zoomControl: false,
      attributionControl: true
    });

    L.control.zoom({ position: 'topleft' }).addTo(newMap);

    // Add Basemap Layers
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Imagery © Esri'
    }).addTo(newMap);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Imagery © Esri'
    }).addTo(newMap);

    map.current = newMap;
  }, []);

  useEffect(() => {
    if (!map.current) return;
    const newMap = map.current;

    // Clear existing layers (except basemaps)
    newMap.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
        newMap.removeLayer(layer);
      }
    });

    // 0. Transaction Lines
    if (edges.length > 0) {
      edges.forEach(edge => {
        const source = locations.find(l => l.id === edge.sourceId);
        const target = locations.find(l => l.id === edge.targetId);
        if (!source || !target) return;

        const color = source.riskLevel === 'CRITICAL' ? '#EF4444' :
          source.riskLevel === 'HIGH' ? '#F97316' :
            source.riskLevel === 'MEDIUM' ? '#F59E0B' : '#22C55E';

        L.polyline([
          [source.latitude, source.longitude],
          [target.latitude, target.longitude]
        ], {
          color: color,
          weight: 1.5,
          opacity: 0.8,
          dashArray: '4, 4'
        }).addTo(newMap);
      });
    }

    // 1 & 2. Risk points, glows, and permanent popups
    if (locations.length > 0) {
      locations.forEach(point => {
        const riskColor = point.riskLevel === 'CRITICAL' ? '#EF4444' :
          point.riskLevel === 'HIGH' ? '#F97316' :
            point.riskLevel === 'MEDIUM' ? '#F59E0B' : '#22C55E';

        // Add inner/outer glow circles
        const radiusMap = {
          'CRITICAL': 32,
          'HIGH': 24,
          'MEDIUM': 18,
          'LOW': 14
        };

        // Outer glow
        L.circleMarker([point.latitude, point.longitude], {
          radius: radiusMap[point.riskLevel as keyof typeof radiusMap] || 12,
          color: 'transparent',
          fillColor: riskColor,
          fillOpacity: 0.25,
          interactive: false
        }).addTo(newMap);

        // Inner glow
        L.circleMarker([point.latitude, point.longitude], {
          radius: (radiusMap[point.riskLevel as keyof typeof radiusMap] || 12) * 0.6,
          color: 'transparent',
          fillColor: riskColor,
          fillOpacity: 0.45,
          interactive: false
        }).addTo(newMap);

        // Core dot
        L.circleMarker([point.latitude, point.longitude], {
          radius: 4,
          color: '#ffffff',
          weight: 1.5,
          fillColor: riskColor,
          fillOpacity: 1,
          interactive: false
        }).addTo(newMap);

        // Only show popups for HIGH and CRITICAL risks or specific ones to avoid clutter
        if (point.riskLevel === 'LOW' && locations.length > 10) return;

        const html = `
          <div class="rttmt-leaflet-popup bg-white rounded shadow-sm border border-slate-200 text-xs px-2 py-1 font-sans min-w-[120px] text-center">
            <div class="font-semibold text-slate-800">${point.city}</div>
            <div class="text-slate-600 text-[10px] mt-0.5 mb-1">${point.transactions.toLocaleString()} txns - ${point.alerts} alerts</div>
            <div class="font-bold text-[10px] uppercase" style="color: ${riskColor}">${point.riskLevel}</div>
          </div>
        `;

        L.marker([point.latitude, point.longitude], {
          icon: L.divIcon({
            className: 'custom-popup-icon',
            html: html,
            iconSize: [120, 50],
            iconAnchor: [-10, 25] // Offset to the right
          }),
          interactive: false
        }).addTo(newMap);
      });
    }

    // 3. Simulated live transactions (Blink Effect)
    const triggerBlink = () => {
      if (!newMap || !locations.length) return;

      const randomLoc = locations[Math.floor(Math.random() * locations.length)];

      const color = randomLoc.riskLevel === 'CRITICAL' ? '#EF4444' :
        randomLoc.riskLevel === 'HIGH' ? '#F97316' :
          randomLoc.riskLevel === 'MEDIUM' ? '#F59E0B' : '#22C55E';

      const blinkIcon = L.divIcon({
        className: 'rttmt-blink-container',
        html: `<div class="rttmt-blink-marker" style="background-color: ${color}; box-shadow: 0 0 10px ${color}, 0 0 20px ${color};"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([randomLoc.latitude, randomLoc.longitude], { icon: blinkIcon, interactive: false }).addTo(newMap);

      setTimeout(() => {
        if (newMap.hasLayer(marker)) {
          newMap.removeLayer(marker);
        }
      }, 2000);
    };

    const blinkInterval = setInterval(triggerBlink, 2000);

    return () => {
      clearInterval(blinkInterval);
    };
  }, [locations, edges]);

  // Handle resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        map.current.invalidateSize();
      }
    });
    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-background z-0 isolate", className)}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-container {
          background: #000;
          font-family: inherit;
        }
        .custom-popup-icon {
          background: transparent;
          border: none;
        }
        .rttmt-leaflet-popup {
          position: relative;
          z-index: 500;
        }
        .rttmt-leaflet-popup::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -4px;
          transform: translateY(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background: white;
          border-left: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }
        .rttmt-blink-container {
          pointer-events: none;
          z-index: 1000 !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rttmt-blink-marker {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          animation: map-ping 2s cubic-bezier(0, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        @keyframes map-ping {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          70%, 100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}} />
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
