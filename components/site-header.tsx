
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo, Menu, X } from './icons';

const navLinks = [
  { href: '/property-finder', label: 'Search Rentals' },
  { href: '/cities', label: 'Cities' },
  { href: '/property-finder?city=Bengaluru', label: 'Bengaluru Homes' },
];

export function SiteHeader() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-6 w-6 text-blue-600 group-hover:animate-pulse" />
            <span className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Property Finder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  hover:text-blue-600 transition-colors
                  ${pathname === link.href ? 'text-blue-600' : ''}
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop "List Property" Button */}
          <div className="hidden md:flex items-center">
            <a
              href="mailto:hello@propertyfinder.in"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm transition-colors"
            >
              List a Property
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t border-slate-200 z-40">
          <nav className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  text-base font-semibold text-slate-700 hover:text-blue-600
                  ${pathname === link.href ? 'text-blue-600' : ''}
                `}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:hello@propertyfinder.in"
              className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm transition-colors"
            >
              List a Property
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}