// PropertyPopup.tsx - Clean Airbnb Style with Link
'use client';

import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyPopupProps {
  property: Property;
}

export default function PropertyPopup({ property }: PropertyPopupProps) {
  return (
    <Link 
      href={`/property/${property.id}`} 
      className="block group"
      onClick={() => {
        try {
          const viewed = JSON.parse(sessionStorage.getItem('lastViewedProperties') || '[]');
          const updated = [property.id, ...viewed.filter((id: string) => id !== property.id)].slice(0, 5);
          sessionStorage.setItem('lastViewedProperties', JSON.stringify(updated));
        } catch {}
      }}
    >
      {/* Image */}
      <div className="relative w-full aspect-square rounded-t-xl overflow-hidden">
        <Image
          src={property.photo}
          alt={property.title || 'Property'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="280px"
          unoptimized
        />
        <button 
          className="absolute top-2 right-2 p-1.5 hover:scale-110 transition-transform z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-5 h-5 fill-gray-900/50 stroke-white stroke-2" viewBox="0 0 32 32">
            <path d="M16 28c7-4.733 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-4.95-2.05c-3.86 0-7 3.14-7 7 0 7 7 12.267 14 17z"></path>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-3 bg-white rounded-b-xl">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm flex-1 pr-2">
            {property.city}, {property.neighborhood}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium">4.9</span>
          </div>
        </div>

        <p className="text-gray-600 text-xs mb-2 line-clamp-1">
          {property.title}
        </p>

        <p className="text-gray-600 text-xs mb-2">
          {property.bedrooms} bed · {property.bathrooms} bath
        </p>

        <div>
          <span className="font-semibold text-gray-900 text-sm">₹{property.price.toLocaleString('en-IN')}</span>
          <span className="text-gray-600 text-xs"> / month</span>
        </div>
      </div>
    </Link>
  );
}