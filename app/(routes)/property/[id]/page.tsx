import { notFound } from 'next/navigation';
import { properties } from '@/data/properties';
import { Property } from '@/types/property';
import Image from 'next/image';
import { Metadata } from 'next';
import LastViewedProperties from '@/components/LastViewedProperties';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);

  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  const title = property.title || `${property.type.charAt(0).toUpperCase() + property.type.slice(1)} Property`;
  const description = property.description || `Beautiful ${property.type} available for ₹${property.price.toLocaleString('en-IN')} per month`;

  return {
    title: `${title} - Property Finder`,
    description,
    openGraph: {
      title: `${title} - Property Finder`,
      description,
      images: [
        {
          url: property.photo,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      siteName: 'Property Finder',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Property Finder`,
      description,
      images: [property.photo],
    },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Local Header */}
      <header className="bg-white border-b border-slate-200 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/property-finder" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
            ← Back to Map
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow">
              <Image
                src={property.photo}
                alt={property.title || 'Property'}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                unoptimized
              />
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-4 py-2 text-[11px] font-semibold text-white bg-blue-600 rounded-full uppercase tracking-wide">
                      {property.type}
                    </span>
                    <span className="inline-block px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full uppercase tracking-wide">
                      {property.city}
                    </span>
                  </div>
                  {property.neighborhood && (
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                      {property.neighborhood}
                    </p>
                  )}
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {property.title || 'Property'}
                  </h1>
                  {property.description && (
                    <p className="text-slate-700 leading-relaxed">{property.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">
                    ₹{property.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-slate-600">per month</div>
                </div>
              </div>

              {/* Property Features */}
              {(property.bedrooms !== undefined || property.bathrooms !== undefined || property.area) && (
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Property Details</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {property.bedrooms !== undefined && (
                      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-slate-900">{property.bedrooms}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Bedrooms</div>
                      </div>
                    )}
                    {property.bathrooms !== undefined && (
                      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-slate-900">{property.bathrooms}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Bathrooms</div>
                      </div>
                    )}
                    {property.area && (
                      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm text-center">
                        <div className="text-2xl font-bold text-slate-900">{property.area}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Sq Ft</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Location</h2>
                <div className="space-y-1 text-slate-700">
                  <p className="font-medium text-slate-900">{property.city}{property.neighborhood ? ` • ${property.neighborhood}` : ''}</p>
                  <p>Latitude {property.lat.toFixed(4)} / Longitude {property.lng.toFixed(4)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:sticky lg:top-24 z-10">
              <div className="mb-5">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  ₹{property.price.toLocaleString('en-IN')}
                  <span className="text-lg font-normal text-slate-600"> / month</span>
                </div>
                <p className="text-sm text-slate-600">Includes access to premium resident amenities</p>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm">
                Book a Visit
              </button>
            </div>

            {/* Last Viewed Properties */}
            <div className="relative z-0">
              <LastViewedProperties currentPropertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


