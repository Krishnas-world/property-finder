// PropertyList.tsx - Airbnb Grid Style with Hover
'use client';

import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PropertyListProps {
  properties: Property[];
  viewportBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null;
  filters: {
    priceRange: [number, number];
    propertyTypes: string[];
    cities: string[];
  };
  onPropertyClick: (property: Property) => void;
  onPropertyHover: (property: Property | null) => void;
  selectedProperty: Property | null;
}

export default function PropertyList({
  properties,
  viewportBounds,
  filters,
  onPropertyClick,
  onPropertyHover,
  selectedProperty,
}: PropertyListProps) {
  const [visibleProperties, setVisibleProperties] = useState<Property[]>([]);

  useEffect(() => {
    let filtered = properties.filter(property => {
      const inPriceRange = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
      const matchesType = filters.propertyTypes.length === 0 || filters.propertyTypes.includes(property.type);
      const matchesCity = filters.cities.length === 0 || filters.cities.includes(property.city);
      return inPriceRange && matchesType && matchesCity;
    });

    if (viewportBounds) {
      filtered = filtered.filter(property => {
        return (
          property.lat >= viewportBounds.south &&
          property.lat <= viewportBounds.north &&
          property.lng >= viewportBounds.west &&
          property.lng <= viewportBounds.east
        );
      });
    }

    setVisibleProperties(filtered);
  }, [properties, viewportBounds, filters]);

  if (visibleProperties.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No exact matches</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:px-10 lg:py-8">
      <p className="text-sm text-gray-600 mb-4 sm:mb-6">Over {visibleProperties.length} stays</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-6 sm:gap-y-8">
        {visibleProperties.map((property) => (
          <div
            key={property.id}
            className="group cursor-pointer"
            onMouseEnter={() => onPropertyHover(property)}
            onMouseLeave={() => onPropertyHover(null)}
            onClick={() => onPropertyClick(property)}
          >
            {/* Image */}
            <div className={`relative aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden mb-3 transition-all ${
              selectedProperty?.id === property.id ? 'ring-2 ring-gray-900 ring-offset-2' : ''
            }`}>
              <Image
                src={property.photo}
                alt={property.title || 'Property'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                unoptimized
              />
              <button 
                className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-6 h-6 fill-gray-900/50 stroke-white stroke-2" viewBox="0 0 32 32">
                  <path d="M16 28c7-4.733 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-4.95-2.05c-3.86 0-7 3.14-7 7 0 7 7 12.267 14 17z"></path>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {property.city}, {property.neighborhood}
                  </h3>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium">4.9</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm truncate mb-1">
                {property.title}
              </p>

              <p className="text-gray-600 text-sm mb-1">
                {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''} · {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
              </p>

              <div className="mt-2">
                <span className="font-semibold text-gray-900">₹{property.price.toLocaleString('en-IN')}</span>
                <span className="text-gray-600 text-sm"> / month</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}