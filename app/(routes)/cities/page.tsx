import Link from 'next/link';
import { properties } from '@/data/properties';

const cityStats = Object.values(
  properties.reduce<Record<
    string,
    {
      city: string;
      count: number;
      average: number;
      total: number;
      min: number;
      max: number;
      popularType: Record<string, number>;
    }
  >>((acc, property) => {
    if (!acc[property.city]) {
      acc[property.city] = {
        city: property.city,
        count: 0,
        average: 0,
        total: 0,
        min: property.price,
        max: property.price,
        popularType: {},
      };
    }
    const city = acc[property.city];
    city.count += 1;
    city.total += property.price;
    city.average = Math.round(city.total / city.count);
    city.min = Math.min(city.min, property.price);
    city.max = Math.max(city.max, property.price);
    city.popularType[property.type] = (city.popularType[property.type] || 0) + 1;
    return acc;
  }, {})
).map((city) => {
  const sortedTypes = Object.entries(city.popularType).sort((a, b) => b[1] - a[1]);
  const favouriteType = sortedTypes[0]?.[0] ?? 'apartment';
  return {
    ...city,
    favouriteType,
  };
});

const sortedCities = cityStats.sort((a, b) => b.count - a.count || b.average - a.average);

export default function CitiesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-white to-slate-50">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">neighbourhood insights</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Live where the city feels like home.</h1>
          <p className="mt-4 text-slate-600">
            Explore curated rental insights across India&apos;s most desirable neighbourhoods. Compare average rents, property mix,
            and available inventory before you book a viewing.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {sortedCities.map((city) => (
            <Link
              key={city.city}
              href={`/property-finder?city=${encodeURIComponent(city.city)}`}
              className="group rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {city.city}
                </h2>
                <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                  {city.count} listings
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Average Rent</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    ₹{city.average.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Popular Type</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {city.favouriteType.charAt(0).toUpperCase() + city.favouriteType.slice(1)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Entry-Level</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    ₹{city.min.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Premium</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    ₹{city.max.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-blue-500">
                View homes in {city.city} →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}


