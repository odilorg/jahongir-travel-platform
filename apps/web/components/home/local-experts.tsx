import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
  { value: '8000+', label: 'Happy Travelers' },
  { value: '15+', label: 'Years Experience' },
  { value: '50+', label: 'Expert Guides' },
  { value: '100%', label: 'Satisfaction' },
];

const checklistItems = [
  'Expert local guides with deep cultural knowledge',
  'Hands-on craft workshops with master artisans',
  'Authentic experiences in historic ateliers',
  'Small groups for personalized attention',
  '24/7 support throughout your journey',
];

export function LocalExperts() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="bg-brand-cream p-8 md:p-10 rounded-2xl">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
              Trusted Local Experts in
              <span className="text-brand-orange block">
                Uzbekistan's Legendary Destinations
              </span>
            </h2>

            <ul className="space-y-4 mb-8">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/tours">
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
              >
                Explore Our Tours
              </Button>
            </Link>
          </div>

          {/* Right: Stats + Image Grid */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100"
                >
                  <div className="text-3xl md:text-4xl font-bold text-brand-orange mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=400&fit=crop"
                  alt="Uzbek architecture"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=400&fit=crop"
                  alt="Traditional crafts"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1513415277900-79fd9c61a4f5?w=400&h=400&fit=crop"
                  alt="Silk Road history"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=400&fit=crop"
                  alt="Cultural experience"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
