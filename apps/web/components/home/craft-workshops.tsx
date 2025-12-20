import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
  'Learn traditional pottery and ceramics techniques',
  'Create your own silk embroidery masterpiece',
  'Discover ancient metalworking and jewelry crafts',
  'Work alongside master artisans in authentic workshops',
  'Take home your handcrafted creations',
];

export function CraftWorkshops() {
  return (
    <section className="py-16 md:py-20 bg-amber-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop"
                alt="Craftsman working on pottery"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 md:bottom-6 md:right-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏺</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">200+ Workshops</p>
                  <p className="text-sm text-gray-500">Across 5 cities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="order-1 lg:order-2">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Craft Workshops
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
              Master Ancient Uzbek Crafts From Expert Working Artisans
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Immerse yourself in centuries-old traditions. Our workshops connect you
              directly with master craftspeople who have inherited their skills through
              generations.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/tours?category=workshops">
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-8"
              >
                View All Workshops
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
