'use client';

import { useEffect, useState } from 'react';
import { properties } from '@/data/properties';
import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';

interface LastViewedPropertiesProps {
  currentPropertyId: string;
}

export default function LastViewedProperties({ currentPropertyId }: LastViewedPropertiesProps) {
  const [viewedProperties, setViewedProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const viewedIds = JSON.parse(sessionStorage.getItem('lastViewedProperties') || '[]');
      const viewed = viewedIds
        .map((id: string) => properties.find(p => p.id === id))
        .filter((p: Property | undefined): p is Property => p !== undefined && p.id !== currentPropertyId)
        .slice(0, 3);
      setViewedProperties(viewed);
    }
  }, [currentPropertyId]);

  if (viewedProperties.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Recently Viewed</h2>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
        {viewedProperties.map((property) => (
          <Link
            key={property.id}
            href={`/property/${property.id}`}
            className="block group"
          >
            <div className="flex gap-3 p-2 rounded-lg hover:bg-white transition-colors">
              <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                <Image
                  src={property.photo}
                  alt={property.title || 'Property'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="80px"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {property.title || 'Property'}
                </h3>
                <p className="text-xs text-gray-500 uppercase mt-1">{property.type}</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">₹{property.price.toLocaleString('en-IN')}/month</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

