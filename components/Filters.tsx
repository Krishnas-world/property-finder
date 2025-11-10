// Filters.tsx - Airbnb Style Horizontal Filters
'use client';

import { Property } from '@/types/property';
import { useState } from 'react';

interface FiltersProps {
  priceRange: [number, number];
  propertyTypes: string[];
  cities: string[];
  onPriceRangeChange: (range: [number, number]) => void;
  onPropertyTypesChange: (types: string[]) => void;
  onCitiesChange: (cities: string[]) => void;
  properties: Property[];
}

const propertyTypeOptions = ['apartment', 'house', 'condo', 'villa', 'studio'] as const;

export default function Filters({
  priceRange,
  propertyTypes,
  cities,
  onPriceRangeChange,
  onPropertyTypesChange,
  onCitiesChange,
  properties,
}: FiltersProps) {
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const minPrice = Math.min(...properties.map(p => p.price));
  const maxPrice = Math.max(...properties.map(p => p.price));
  const cityOptions = Array.from(new Set(properties.map((p) => p.city))).sort((a, b) => a.localeCompare(b));

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    }
    if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    onPriceRangeChange(newRange);
  };

  const handleTypeToggle = (type: string) => {
    if (propertyTypes.includes(type)) {
      onPropertyTypesChange(propertyTypes.filter(t => t !== type));
    } else {
      onPropertyTypesChange([...propertyTypes, type]);
    }
  };

  const hasFilters = priceRange[0] !== minPrice || priceRange[1] !== maxPrice || propertyTypes.length > 0 || cities.length > 0;

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap overflow-x-auto py-1">
      {/* Property Type Pills */}
      {propertyTypeOptions.map((type) => (
        <button
          key={type}
          onClick={() => handleTypeToggle(type)}
          className={`px-4 sm:px-5 py-2.5 text-sm font-medium rounded-full border transition-colors shrink-0 ${
            propertyTypes.includes(type)
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
          }`}
          type="button"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}

      {/* Price Filter */}
      <div className="relative">
        <button
          onClick={() => setShowPriceDropdown(!showPriceDropdown)}
          className={`px-4 sm:px-5 py-2.5 text-sm font-medium rounded-full border transition-colors flex items-center gap-2 shrink-0 ${
            priceRange[0] !== minPrice || priceRange[1] !== maxPrice
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
          }`}
        >
          Price Range
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showPriceDropdown && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-3xl shadow-xl p-6 w-72 sm:w-80 z-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-3">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={5000}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={5000}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* City Pills */}
      {cityOptions.map((city) => (
        <button
          key={city}
          onClick={() =>
            cities.includes(city)
              ? onCitiesChange(cities.filter((c) => c !== city))
              : onCitiesChange([...cities, city])
          }
          className={`px-4 sm:px-5 py-2.5 text-sm font-medium rounded-full border transition-colors shrink-0 ${
            cities.includes(city)
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
          }`}
          type="button"
        >
          {city}
        </button>
      ))}

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={() => {
            onPriceRangeChange([minPrice, maxPrice]);
            onPropertyTypesChange([]);
            onCitiesChange([]);
          }}
          className="px-4 sm:px-5 py-2.5 text-sm font-medium text-gray-700 underline hover:text-gray-900 shrink-0"
        >
          Clear all
        </button>
      )}
    </div>
  );
}