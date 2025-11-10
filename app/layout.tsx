
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Linkedin, Logo, Twitter } from '@/components/icons';
import { SiteHeader } from '@/components/site-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: {
    default: 'Property Finder India – Premium Rentals for Modern Living',
    template: '%s | Property Finder India',
  },
  description:
    'Discover fully-furnished premium rentals across Mumbai, Delhi, Bengaluru, Hyderabad, Pune, and Chennai. Filter by city, budget, and property type to find your next home.',
  metadataBase: new URL('https://propertyfinder.in'), 
  openGraph: {
    title: 'Property Finder India – Premium Rentals for Modern Living',
    description:
      'Discover fully-furnished premium rentals across India’s top cities with interactive maps, verified listings, and curated neighbourhood insights.',
    url: 'https://propertyfinder.in', 
    siteName: 'Property Finder India',

    images: [
      {
        url: '/og-image.png', 
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Property Finder India – Premium Rentals for Modern Living',
    description:
      'Browse premium rentals with interactive maps, verified listings, and curated neighbourhood insights across India.',
    
  },
  
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-800`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Use the new SiteHeader component */}
          <SiteHeader />

          <main className="flex-1">{children}</main>

          {/* --- A More Polished Footer --- */}
          <footer className="border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col gap-4 items-center md:items-start">
                  <div className="flex items-center gap-2">
                    <Logo className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold text-slate-900">
                      Property Finder
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    © {new Date().getFullYear()} Property Finder India.
                    <br />
                    Crafted for elevated urban living.
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4">
                  <div className="flex items-center gap-6">
                    <a
                      href="https://twitter.com" // Replace with your URL
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a
                      href="https://linkedin.com" // Replace with your URL
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-700 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                  <div className="text-sm text-slate-500 flex flex-col sm:flex-row gap-x-4 gap-y-2 items-center">
                    <a
                      href="mailto:hello@propertyfinder.in"
                      className="hover:text-blue-600 transition-colors"
                    >
                      hello@propertyfinder.in
                    </a>
                    <span className="hidden sm:inline">·</span>
                    <a
                      href="tel:+919999999999"
                      className="hover:text-blue-600 transition-colors"
                    >
                      +91-99999-99999
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}