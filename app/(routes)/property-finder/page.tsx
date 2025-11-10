// page.tsx - Main Property Finder Page (Airbnb Style)
'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import Filters from '@/components/Filters';
import PropertyList from '@/components/PropertyList';
import { properties } from '@/data/properties';
import { Property } from '@/types/property';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

const allPrices = properties.map((property) => property.price);
const MIN_PRICE = Math.min(...allPrices);
const MAX_PRICE = Math.max(...allPrices);

export default function PropertyFinderPage() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [viewportBounds, setViewportBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  useEffect(() => {
    if (!cityParam) return;
    const decodedCity = decodeURIComponent(cityParam);
    if (properties.some((property) => property.city === decodedCity) && selectedCities.length === 0) {
      setSelectedCities([decodedCity]);
    }
  }, [cityParam, selectedCities.length]);

  const filteredForStats = useMemo(() => {
    return properties.filter((property) => {
      const withinBudget = property.price >= priceRange[0] && property.price <= priceRange[1];
      const matchesType = propertyTypes.length === 0 || propertyTypes.includes(property.type);
      const matchesCity = selectedCities.length === 0 || selectedCities.includes(property.city);
      return withinBudget && matchesType && matchesCity;
    });
  }, [priceRange, propertyTypes, selectedCities]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    if (typeof window !== 'undefined') {
      const viewed = JSON.parse(sessionStorage.getItem('lastViewedProperties') || '[]');
      const updated = [property.id, ...viewed.filter((id: string) => id !== property.id)].slice(0, 5);
      sessionStorage.setItem('lastViewedProperties', JSON.stringify(updated));
    }
  };

  const handlePropertyHover = (property: Property | null) => {
    setHoveredProperty(property);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-10 py-4">

        </div>
        
        {/* Filters Bar */}
        <div className="px-4 sm:px-6 lg:px-10 pb-3">
          <Filters
            priceRange={priceRange}
            propertyTypes={propertyTypes}
            cities={selectedCities}
            onPriceRangeChange={setPriceRange}
            onPropertyTypesChange={setPropertyTypes}
            onCitiesChange={setSelectedCities}
            properties={properties}
          />
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        {/* Left - Property List */}
        <div className="w-full lg:w-[45%] overflow-y-auto order-2 lg:order-1 h-auto lg:h-[calc(100vh-80px)]">
          <PropertyList
            properties={properties}
            viewportBounds={viewportBounds}
            filters={{ priceRange, propertyTypes, cities: selectedCities }}
            onPropertyClick={handlePropertyClick}
            onPropertyHover={handlePropertyHover}
            selectedProperty={selectedProperty}
          />
        </div>

        {/* Right - Map (Fixed) */}
        <div className="w-full lg:w-[55%] order-1 lg:order-2 h-[50vh] lg:h-[calc(100vh-80px)] lg:sticky lg:top-[64px]">
          <PropertyMap
            properties={properties}
            selectedProperty={selectedProperty}
            hoveredProperty={hoveredProperty}
            onPropertySelect={setSelectedProperty}
            onViewportChange={setViewportBounds}
            filters={{ priceRange, propertyTypes, cities: selectedCities }}
          />
        </div>
      </div>
    </div>
  );
}