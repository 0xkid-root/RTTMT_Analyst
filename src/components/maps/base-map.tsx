'use client';

import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';

interface BaseMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function BaseMap({ center = [0, 0], zoom = 2, className = "w-full h-[400px]" }: BaseMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center,
      zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  }, [center, zoom]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className={className} />
    </div>
  );
}
