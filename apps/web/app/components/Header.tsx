'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              jahongir<span className="text-orange-500">travel</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/tours" className="text-white hover:text-orange-400 transition-colors">
              Tours
            </Link>
            <Link href="/workshops" className="text-white hover:text-orange-400 transition-colors">
              Workshops
            </Link>
            <Link href="/blog" className="text-white hover:text-orange-400 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-white hover:text-orange-400 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-white hover:text-orange-400 transition-colors">
              Contacts
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-black/90 rounded-lg p-4 mb-4">
            <div className="flex flex-col space-y-4">
              <Link href="/tours" className="text-white hover:text-orange-400">Tours</Link>
              <Link href="/workshops" className="text-white hover:text-orange-400">Workshops</Link>
              <Link href="/blog" className="text-white hover:text-orange-400">Blog</Link>
              <Link href="/about" className="text-white hover:text-orange-400">About Us</Link>
              <Link href="/contact" className="text-white hover:text-orange-400">Contacts</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
