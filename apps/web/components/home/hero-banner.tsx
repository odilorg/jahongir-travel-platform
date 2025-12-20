'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <>
      {/* Orange Banner */}
      <div className="bg-brand-orange text-white py-3 text-center">
        <p className="text-sm md:text-base font-medium tracking-wide">
          Join the Guild, Revive the Classics, Preserve the Tradition
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&h=1080&fit=crop')",
          }}
        >
          {/* Minimal overlay - lighter than before */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Discover the Ancient
              <br />
              Silk Road Crafts
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
              Experience hands-on workshops with master artisans in Uzbekistan's legendary cities
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tours">
                <Button
                  size="lg"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-8 py-6 text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 100V50C240 0 480 0 720 50C960 100 1200 100 1440 50V100H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>
    </>
  );
}
