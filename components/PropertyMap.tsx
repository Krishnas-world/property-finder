
'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/types/property';
import PropertyPopup from './PropertyPopup';
import { createRoot } from 'react-dom/client';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  hoveredProperty: Property | null;
  onPropertySelect: (property: Property | null) => void;
  onViewportChange: (bounds: { north: number; south: number; east: number; west: number }) => void;
  filters: {
    priceRange: [number, number];
    propertyTypes: string[];
    cities: string[];
  };
}

export default function PropertyMap({
  properties,
  selectedProperty,
  hoveredProperty,
  onPropertySelect,
  onViewportChange,
  filters,
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const popupRef = useRef<L.Popup | null>(null);
  const popupContentRef = useRef<HTMLDivElement | null>(null);
  const popupRootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  const popupResizeObserverRef = useRef<ResizeObserver | null>(null);
  const [mounted, setMounted] = useState(false);

  const filteredProperties = properties.filter((property) => {
    const inPriceRange = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
    const matchesType = filters.propertyTypes.length === 0 || filters.propertyTypes.includes(property.type);
    const matchesCity = filters.cities.length === 0 || filters.cities.includes(property.city);
    return inPriceRange && matchesType && matchesCity;
  });

  useEffect(() => {
    if (selectedProperty && !filteredProperties.some((property) => property.id === selectedProperty.id)) {
      onPropertySelect(null);
    }
  }, [filteredProperties, selectedProperty, onPropertySelect]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: [19.076, 72.8777],
      zoom: 6,
      minZoom: 5,
      maxZoom: 18,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    const updateBounds = () => {
      const bounds = map.getBounds();
      onViewportChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    };

    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);
    updateBounds();

    setMounted(true);

    return () => {
      map.off('moveend', updateBounds);
      map.off('zoomend', updateBounds);

      markersRef.current.forEach((marker) => {
        map.removeLayer(marker);
      });
      markersRef.current.clear();

      if (popupResizeObserverRef.current) {
        popupResizeObserverRef.current.disconnect();
        popupResizeObserverRef.current = null;
      }

      if (popupRef.current) {
        map.removeLayer(popupRef.current);
        popupRef.current = null;
      }
      requestAnimationFrame(() => {
        if (popupRootRef.current) {
          popupRootRef.current.unmount();
          popupRootRef.current = null;
        }
        popupContentRef.current = null;
      });

      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onViewportChange]);


  useEffect(() => {
    if (!mapInstanceRef.current || !mounted) return;

    const map = mapInstanceRef.current;

    markersRef.current.forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current.clear();

    filteredProperties.forEach((property) => {
      const isSelected = selectedProperty?.id === property.id;
      const isHovered = hoveredProperty?.id === property.id;

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative; cursor: pointer;">
            <svg width="40" height="50" viewBox="0 0 40 50" style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));">
              <path d="M20 0C8.95 0 0 8.95 0 20c0 11.05 20 30 20 30s20-18.95 20-30C40 8.95 31.05 0 20 0z" 
                    fill="${isSelected || isHovered ? '#222222' : '#FF385C'}" 
                    stroke="white" 
                    stroke-width="2"/>
              <text x="20" y="22" 
                    font-size="11" 
                    font-weight="600" 
                    fill="white" 
                    text-anchor="middle" 
                    dominant-baseline="middle">
                ₹${(property.price / 1000).toFixed(0)}K
              </text>
            </svg>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
      });

      const marker = L.marker([property.lat, property.lng], {
        icon: customIcon,
        zIndexOffset: isSelected || isHovered ? 1000 : 0,
      }).addTo(map);

      marker.on('click', () => {
        onPropertySelect(property);
      });

      markersRef.current.set(property.id, marker);
    });
  }, [filteredProperties, mounted, selectedProperty, hoveredProperty, onPropertySelect]);

  const ensurePopupInView = () => {
    try {
      const map = mapInstanceRef.current;
      if (!map) return;
      const mapEl = map.getContainer();
      const popupEl = document.querySelector('.leaflet-popup') as HTMLElement | null;
      if (!popupEl) return;

      const mapRect = mapEl.getBoundingClientRect();
      const popupRect = popupEl.getBoundingClientRect();
      const padding = 16; 

      let panX = 0;
      let panY = 0;

      if (popupRect.right > mapRect.right - padding) {
        panX -= popupRect.right - (mapRect.right - padding);
      }
     
      if (popupRect.left < mapRect.left + padding) {
        panX += (mapRect.left + padding) - popupRect.left;
      }
    
      if (popupRect.bottom > mapRect.bottom - padding) {
        panY -= popupRect.bottom - (mapRect.bottom - padding);
      }
  
      if (popupRect.top < mapRect.top + padding) {
        panY += (mapRect.top + padding) - popupRect.top;
      }

      if (panX !== 0 || panY !== 0) {
        map.panBy([panX, panY], { animate: true });
      }
    } catch {}
  };

  
  useEffect(() => {
    if (!mapInstanceRef.current || !mounted) return;

    const map = mapInstanceRef.current;

    if (!selectedProperty) {
      if (popupRef.current) {
        map.closePopup(popupRef.current);
        popupRef.current = null;
      }
      if (popupResizeObserverRef.current) {
        popupResizeObserverRef.current.disconnect();
        popupResizeObserverRef.current = null;
      }
      requestAnimationFrame(() => {
        if (popupRootRef.current) {
          popupRootRef.current.unmount();
          popupRootRef.current = null;
        }
        popupContentRef.current = null;
      });
      return;
    }

    map.flyTo([selectedProperty.lat, selectedProperty.lng], Math.max(map.getZoom(), 13), {
      animate: true,
      duration: 0.6,
    });

    if (!popupContentRef.current) {
      popupContentRef.current = document.createElement('div');
      popupRootRef.current = createRoot(popupContentRef.current);

      const popup = L.popup({
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
        maxWidth: 280,
        className: 'airbnb-popup',
        offset: [0, -50],
        autoPan: true,
        autoPanPadding: [60, 60],
      })
        .setLatLng([selectedProperty.lat, selectedProperty.lng])
        .setContent(popupContentRef.current)
        .openOn(map);

      popup.on('remove', () => {
        if (popupResizeObserverRef.current) {
          popupResizeObserverRef.current.disconnect();
          popupResizeObserverRef.current = null;
        }
        requestAnimationFrame(() => {
          if (popupRootRef.current) {
            popupRootRef.current.unmount();
            popupRootRef.current = null;
          }
          popupContentRef.current = null;
        });
        onPropertySelect(null);
      });

      popupRef.current = popup;
    } else {
      popupRef.current?.setLatLng([selectedProperty.lat, selectedProperty.lng]);
    }

   
    popupRootRef.current?.render(<PropertyPopup property={selectedProperty} />);


    requestAnimationFrame(() => {
      ensurePopupInView();
      setTimeout(() => ensurePopupInView(), 80);
      setTimeout(() => ensurePopupInView(), 200);
    });

    if (popupContentRef.current) {
      if (popupResizeObserverRef.current) {
        popupResizeObserverRef.current.disconnect();
      }
      popupResizeObserverRef.current = new ResizeObserver(() => {
        ensurePopupInView();
      });
      popupResizeObserverRef.current.observe(popupContentRef.current);
    }
  }, [selectedProperty, mounted, onPropertySelect]);

  return (
    <div className="w-full h-full relative">
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .leaflet-popup-content {
          margin: 0;
          width: 280px !important;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}