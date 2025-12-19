
import React, { useEffect, useRef } from 'react';
import { MAP_LOCATIONS } from '../constants';

declare global {
  interface Window {
    L: any;
  }
}

const GlobalGlobe = ({ accentColor, darkMode }: { accentColor: string, darkMode: boolean }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safety check for container and Leaflet library
    if (!mapContainerRef.current || !window.L) return;

    // Initialize Map only if it hasn't been created
    if (!mapRef.current) {
      mapRef.current = window.L.map(mapContainerRef.current, {
        center: [30, 0], // Center to show both US, Europe and India nicely
        zoom: 2,
        minZoom: 1.5,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false
      });
    }

    const map = mapRef.current;

    // Premium Tile Layer based on theme (CartoDB Voyager for light, Dark Matter for dark)
    const tileUrl = darkMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';
    
    map.eachLayer((layer: any) => layer.remove());

    window.L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
      opacity: darkMode ? 0.9 : 1
    }).addTo(map);

    const baseLocation = MAP_LOCATIONS.find(l => l.base);

    // Create markers
    MAP_LOCATIONS.forEach((loc) => {
      const isBase = loc.base;
      const color = isBase ? '#ef4444' : (loc.type === 'intl' ? accentColor : '#10b981');
      
      const iconHtml = `
        <div class="relative group cursor-pointer" style="width: 16px; height: 16px;">
          <div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background-color: ${color}"></div>
          <div class="relative rounded-full border-2 border-white dark:border-slate-900 shadow-md" style="background-color: ${color}; width: 10px; height: 10px; margin: 3px;"></div>
        </div>
      `;

      const icon = window.L.divIcon({
        className: '',
        html: iconHtml,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10]
      });

      const marker = window.L.marker([loc.lat, loc.lng], { icon: icon }).addTo(map);
      
      // Richer Popup Content
      const popupContent = `
        <div class="font-sans text-center min-w-[120px] p-1">
          <div class="font-bold text-xs text-slate-800 dark:text-slate-100 mb-0.5">${loc.name}</div>
          <div class="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${isBase ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}">
            ${loc.event || 'Academic Visit'}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        autoPan: false
      });

      // Interactive hover
      marker.on('mouseover', function (this: any) {
        this.openPopup();
      });

      // Flight paths (Curves would be ideal, but simple lines work for clarity)
      if (!isBase && baseLocation) {
        window.L.polyline([[baseLocation.lat, baseLocation.lng], [loc.lat, loc.lng]], {
          color: color,
          weight: 1,
          opacity: 0.2,
          className: 'flight-path',
          dashArray: '3, 6'
        }).addTo(map);
      }
    });

  }, [darkMode, accentColor]);

  return (
    <div className="w-full h-full min-h-[inherit] relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/5 transition-all duration-300 rounded-[3rem] overflow-hidden shadow-inner">
       {/* Map Overlay Controls/Legend */}
       <div className="absolute top-6 left-6 z-[400] pointer-events-none">
          <div className="flex flex-col gap-2 text-[10px] uppercase tracking-wider font-bold text-text-muted bg-white/90 dark:bg-slate-900/90 p-3 rounded-2xl backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span> Research Base</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(var(--color-accent),0.6)]" style={{background: accentColor}}></span> International Conf</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> Domestic Conf</span>
          </div>
       </div>
       
       <div ref={mapContainerRef} className="w-full h-full z-[1] outline-none" style={{ background: 'transparent' }} />
    </div>
  )
}

export default GlobalGlobe;
