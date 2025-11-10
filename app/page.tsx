import Link from 'next/link';
import Image from 'next/image';
import { properties } from '@/data/properties';

const cityAggregate = properties.reduce<Record<string, { city: string; count: number; average: number; total: number }>>(
  (acc, property) => {
    if (!acc[property.city]) {
      acc[property.city] = { city: property.city, count: 0, average: 0, total: 0 };
    }
    acc[property.city].count += 1;
    acc[property.city].total += property.price;
    acc[property.city].average = Math.round(acc[property.city].total / acc[property.city].count);
    return acc;
  },
  {}
);

const topCities = Object.values(cityAggregate)
  .sort((a, b) => b.count - a.count || b.average - a.average)
  .slice(0, 6);

const featuredProperties = properties.slice(0, 3);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-purple-200 blur-3xl opacity-60" />
          <div className="absolute -left-10 top-20 h-64 w-64 rounded-full bg-blue-200 blur-3xl opacity-60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 bg-white/80 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Curated Rentals Across India
            </p>
            <h1 className="mt-6 text-5xl font-bold text-slate-900 leading-tight">
              Experience premium rentals tailored for modern urban living.
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Browse furnished apartments, independent villas, and ready-to-move-in residences across Mumbai, Delhi, Bengaluru,
              Hyderabad, Pune, Chennai, and more.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/property-finder"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-full text-white bg-linear-to-r from-blue-600 to-purple-600 shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5"
              >
                Explore Properties
              </Link>
              <Link
                href="/cities"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 transition-all"
              >
                Discover Neighbourhoods
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Active Listings</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{properties.length}</p>
            <p className="mt-2 text-sm text-slate-500">Premium homes reviewed and verified by our team.</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Cities Covered</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{topCities.length}</p>
            <p className="mt-2 text-sm text-slate-500">Across India&apos;s most in-demand neighbourhoods.</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Average Premium Rent</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              ₹{Math.round(properties.reduce((sum, property) => sum + property.price, 0) / properties.length).toLocaleString('en-IN')}
            </p>
            <p className="mt-2 text-sm text-slate-500">Fully-furnished, move-in ready residences.</p>
          </div>
        </div>
      </section>

      {/* Top Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Top Cities to Call Home</h2>
            <p className="text-sm text-slate-500 mt-1">Handpicked neighbourhoods with elevated living experiences.</p>
          </div>
          <Link href="/cities" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View all cities →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {topCities.map((city) => (
            <Link
              key={city.city}
              href={`/property-finder?city=${encodeURIComponent(city.city)}`}
              className="group rounded-3xl bg-white border border-slate-200 shadow-sm p-6 hover:shadow-xl hover:border-blue-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {city.city}
                </h3>
                <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                  {city.count} listings
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Average Rent: <strong className="text-slate-900">₹{city.average.toLocaleString('en-IN')}</strong> per month
              </p>
              <p className="mt-2 text-xs uppercase tracking-wide text-blue-500 font-semibold">
                Explore premium homes →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Homes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Ready-to-Move Homes</h2>
            <p className="text-sm text-slate-500 mt-1">Move-in ready residences curated by interior stylists.</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featuredProperties.map((property) => (
            <Link
              key={property.id}
              href={`/property/${property.id}`}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="relative h-56 sm:h-64">
                <Image
                  src={property.photo}
                  alt={property.title || property.city}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
                <div className="absolute top-4 left-4 space-y-2">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-blue-700 rounded-full shadow">
                    {property.type}
                  </span>
                  <span className="bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-700 rounded-full shadow">
                    {property.city}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {property.title || 'Premium Residence'}
                </h3>
                {property.neighborhood && (
                  <p className="text-sm text-slate-500">{property.neighborhood}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-slate-900">
                    ₹{property.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">per month</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-12 shadow-2xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">List your property with us.</h2>
            <p className="mt-4 text-blue-100">
              Join India&apos;s most trusted premium rental marketplace. Our advisors handle styling, photography, and tenant matchmaking.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:hello@propertyfinder.in"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-full bg-white text-blue-700 shadow-lg hover:shadow-xl transition-all"
              >
                Schedule a consultation
              </a>
              <Link
                href="/property-finder"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-full border border-white/40 text-white hover:bg-white/10 transition-all"
              >
                Explore tenant demand →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
