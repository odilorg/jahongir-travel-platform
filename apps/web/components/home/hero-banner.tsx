'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Heart, Leaf, Award } from 'lucide-react';

const features = [
  { icon: Users, label: 'Family-Run' },
  { icon: Heart, label: 'Authentic Experiences' },
  { icon: Leaf, label: 'Eco-Friendly' },
  { icon: Award, label: 'Expert Guidance' },
];

export function HeroBanner() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&h=1080&fit=crop')",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-20">
        <div className="max-w-4xl">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Live the Craft. Meet the Masters.
            <br />
            Preserve the Tradition.
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-amber-300 font-medium mb-4">
            Small-group craft immersion in Uzbekistan (Max 8 travelers)
          </p>

          {/* Description */}
          <p className="text-lg text-white/90 mb-8 max-w-2xl">
            Spend time with real craft skills, personal connections to master artisans, and
            achieve new creative journeys.
          </p>

          {/* CTA Button */}
          <Link href="/tours">
            <Button
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              View 2025 Craft Workshops
            </Button>
          </Link>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-4 mt-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
              >
                <feature.icon className="h-5 w-5 text-amber-300" />
                <span className="text-white text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
