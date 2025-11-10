# Property Finder India

A premium rental discovery experience built with Next.js 16, Leaflet, and Tailwind CSS. Explore curated homes across India’s top cities with interactive maps, advanced filters, and rich neighbourhood insights.

## Feature Highlights

- 🏠 **Marketing landing page** showcasing hero stats, featured homes, and call-to-actions
- 🗺️ **Leaflet-powered interactive map** (CARTO Light tiles) with animated fly-to and polished gradient markers
- 🎯 **Advanced filters** for monthly budget, property type, and city selection with live stats
- 📍 **Dynamic property list** that responds to the active map viewport
- 🛋️ **Curated property detail pages** with server-side rendering, Open Graph metadata, and “recently viewed” sidebar
- 🏙️ **Cities insights dashboard** showing average rent, inventory, and popular property types per city
- 💾 Session storage to remember the last five properties you explored
- 📱 Fully responsive layout with gradients and glassmorphism accents

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd property-finder
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure (excerpt)

```
property-finder/
├── app/
│   ├── layout.tsx                     # Global layout, navigation, footer, metadata
│   ├── page.tsx                       # Marketing landing page
│   ├── globals.css                    # Tailwind + global tokens
│   └── (routes)/
│       ├── layout.tsx                 # Wrapper for routed views
│       ├── property-finder/page.tsx   # Advanced map + filters experience
│       ├── cities/page.tsx            # City insights dashboard
│       └── property/[id]/page.tsx     # SEO-friendly property detail page
├── components/
│   ├── PropertyMap.tsx                # Leaflet map + markers + popups
│   ├── PropertyList.tsx               # Viewport-aware property list
│   ├── PropertyPopup.tsx              # Gradient popup cards rendered via portals
│   ├── Filters.tsx                    # Budget / type / city filters
│   └── LastViewedProperties.tsx       # Session-based “recently viewed” module
├── data/
│   └── properties.ts                  # Curated Indian rental data
└── types/
    └── property.ts                    # Shared property model
```

## Experience Details

### Interactive Map
- Built directly with **Leaflet** (no react-leaflet dependency) for granular control
- Styled with **CARTO Light** tiles, animated fly-to on selection, scale bar, and gradient price markers
- Popups render React UI via `react-dom/client` roots for polished cards

### Filters & Live Stats
- Monthly budget slider (₹ formatting, 5K increments)
- Property type and city toggles with immediate feedback
- Summary cards update live, showing active inventory and average rent
- Query-string (`?city=Mumbai`) support for deep linking from the Cities page

### Property Detail Pages
- Server-side rendered with Open Graph + Twitter metadata
- Hero imagery, gradient fact cards, and location coordinates
- Booking CTA plus session-powered “recently viewed” feed

### Additional Pages
- **Home**: hero storytelling, featured homes, and CTA
- **Cities**: average rent, inventory, and property mix per city
- Global nav/footer configured in `app/layout.tsx`

## Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 16** (App Router + Metadata API)
- **TypeScript** for full-stack type safety
- **Leaflet** (direct integration) with CARTO basemaps
- **OpenStreetMap** data sources
- **Tailwind CSS v4** for gradients / glassmorphism
- **Next.js Image** for responsive imagery
- **Session Storage** for “recently viewed” persistence

## License

This project is for assessment purposes.
