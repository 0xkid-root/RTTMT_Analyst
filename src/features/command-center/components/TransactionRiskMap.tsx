'use client';

import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const riskColors = {
  LOW: '#22C55E',
  MEDIUM: '#EF4444', // As per screenshot, MEDIUM is red
  HIGH: '#EF4444',
  CRITICAL: '#EF4444'
};

const dummyRiskData = [
  { city: "Chandigarh", latitude: 30.7333, longitude: 76.7794, riskLevel: "MEDIUM", transactions: 10, acc: 9 },
  { city: "Delhi", latitude: 28.6139, longitude: 77.2090, riskLevel: "MEDIUM", transactions: 5, acc: 4 },
  { city: "Jaipur", latitude: 26.9124, longitude: 75.7873, riskLevel: "MEDIUM", transactions: 6, acc: 6 },
  { city: "Ahmedabad", latitude: 23.0225, longitude: 72.5714, riskLevel: "MEDIUM", transactions: 7, acc: 6 },
  { city: "Mumbai", latitude: 19.0760, longitude: 72.8777, riskLevel: "HIGH", transactions: 8, acc: 7 },
  { city: "Kolkata", latitude: 22.5726, longitude: 88.3639, riskLevel: "MEDIUM", transactions: 7, acc: 6 }
];

const dummyEdges = [
  { source: "Delhi", target: "Chandigarh" },
  { source: "Delhi", target: "Jaipur" },
  { source: "Jaipur", target: "Ahmedabad" },
  { source: "Ahmedabad", target: "Mumbai" },
  { source: "Delhi", target: "Kolkata" },
  { source: "Mumbai", target: "Kolkata" }
];

export default function TransactionRiskMap({ className = "" }: { className?: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popupsRef = useRef<maplibregl.Popup[]>([]);

  // Clear array on every render cycle to prevent fast-refresh duplicates
  popupsRef.current = [];

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    const newMap = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: 'Imagery © Esri'
          },
          'esri-labels': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'satellite',
            type: 'raster',
            source: 'esri-satellite',
            paint: {}
          },
          {
            id: 'labels',
            type: 'raster',
            source: 'esri-labels',
            paint: {}
          }
        ]
      },
      center: [79, 22.5],
      zoom: 4.2,
      pitch: 0,
      attributionControl: false
    });

    newMap.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

    let layersInitialized = false;

    const initMapLayers = () => {
      if (layersInitialized) return;
      if (!newMap.isStyleLoaded()) return;
      
      layersInitialized = true;

      // 0. Transaction Lines
      if (!newMap.getSource('network-edges')) {
        const edgeFeatures = dummyEdges.map(edge => {
          const source = dummyRiskData.find(l => l.city === edge.source);
          const target = dummyRiskData.find(l => l.city === edge.target);
          if (!source || !target) return null;
          
          return {
            type: 'Feature' as const,
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                [source.longitude, source.latitude],
                [target.longitude, target.latitude]
              ]
            },
            properties: {
              riskLevel: source.riskLevel
            }
          };
        }).filter(Boolean) as GeoJSON.Feature<GeoJSON.LineString>[];

        newMap.addSource('network-edges', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: edgeFeatures
          }
        });

        newMap.addLayer({
          id: 'edges-layer',
          type: 'line',
          source: 'network-edges',
          paint: {
            'line-color': [
              'match', ['get', 'riskLevel'],
              'CRITICAL', '#EF4444',
              'HIGH', '#F97316',
              'MEDIUM', '#F59E0B',
              'LOW', '#22C55E',
              '#fcd34d'
            ],
            'line-width': 1.5,
            'line-opacity': 0.8,
            'line-dasharray': [2, 4]
          }
        });
      }

      // 1. Risk points and glows
      if (!newMap.getSource('risk-points')) {
        const features = dummyRiskData.map(point => {
          return {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [point.longitude, point.latitude]
            },
            properties: point
          };
        });

        newMap.addSource('risk-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features
          }
        });

        // Glow outer
        newMap.addLayer({
          id: 'risk-glow-outer',
          type: 'circle',
          source: 'risk-points',
          paint: {
            'circle-radius': [
              'match', ['get', 'riskLevel'],
              'CRITICAL', 32,
              'HIGH', 24,
              'MEDIUM', 18,
              'LOW', 14,
              12
            ],
            'circle-color': [
              'match', ['get', 'riskLevel'],
              'CRITICAL', '#EF4444',
              'HIGH', '#F97316',
              'MEDIUM', '#F59E0B',
              'LOW', '#22C55E',
              '#000000'
            ],
            'circle-opacity': 0.25,
            'circle-stroke-width': 0
          }
        });

        // Glow inner
        newMap.addLayer({
          id: 'risk-glow-inner',
          type: 'circle',
          source: 'risk-points',
          paint: {
            'circle-radius': [
              'match', ['get', 'riskLevel'],
              'CRITICAL', 20,
              'HIGH', 16,
              'MEDIUM', 12,
              'LOW', 10,
              8
            ],
            'circle-color': [
              'match', ['get', 'riskLevel'],
              'CRITICAL', '#EF4444',
              'HIGH', '#F97316',
              'MEDIUM', '#F59E0B',
              'LOW', '#22C55E',
              '#000000'
            ],
            'circle-opacity': 0.45,
            'circle-stroke-width': 0
          }
        });

        newMap.addLayer({
          id: 'risk-core',
          type: 'circle',
          source: 'risk-points',
          paint: {
            'circle-radius': 4,
            'circle-color': [
              'match', ['get', 'riskLevel'],
              'CRITICAL', '#EF4444',
              'HIGH', '#F97316',
              'MEDIUM', '#F59E0B',
              'LOW', '#22C55E',
              '#F59E0B'
            ],
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff'
          }
        });

        // 2. Add permanent popups next to each point
        dummyRiskData.forEach(point => {
          const popupContent = document.createElement('div');
          popupContent.className = 'bg-white rounded shadow-sm border border-slate-200 text-xs px-2 py-1 font-sans min-w-[100px] text-center';
          
          popupContent.innerHTML = `
            <div class="font-semibold text-slate-800">${point.city}</div>
            <div class="text-slate-600 text-[10px] mt-0.5 mb-1">${point.transactions} txns - ${point.acc} acc</div>
            <div class="font-bold text-[10px] uppercase" style="color: #DC2626">${point.riskLevel}</div>
          `;

          const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'rttmt-permanent-popup',
            anchor: 'left',
            offset: [8, 0] // Offset to the right of the dot
          })
            .setLngLat([point.longitude, point.latitude])
            .setDOMContent(popupContent)
            .addTo(newMap);
            
          popupsRef.current.push(popup);
        });
      }
    };

    newMap.on('style.load', initMapLayers);
    newMap.on('load', initMapLayers);
    
    if (newMap.isStyleLoaded()) {
      initMapLayers();
    }

    const resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        map.current.resize();
      }
    });

    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
      popupsRef.current.forEach(p => p.remove());
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Run only once

  return (
    <div className={cn("relative w-full h-[520px] overflow-hidden rounded-xl border border-border bg-background", className)}>
      <style dangerouslySetInnerHTML={{__html: `
        .rttmt-permanent-popup .maplibregl-popup-content {
          padding: 0 !important;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        .rttmt-permanent-popup .maplibregl-popup-tip {
          border-right-color: white !important;
        }
      `}} />
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
