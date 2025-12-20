import { Check, Palette, Scissors, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
  'Learn traditional pottery and ceramics techniques',
  'Create your own silk embroidery masterpiece',
  'Discover ancient metalworking and jewelry crafts',
  'Work alongside master artisans in authentic workshops',
  'Take home your handcrafted creations',
];

const crafts = [
  {
    icon: Palette,
    name: 'Ceramics',
    description: 'Blue pottery of Rishton',
  },
  {
    icon: Scissors,
    name: 'Embroidery',
    description: 'Suzani silk patterns',
  },
  {
    icon: Gem,
    name: 'Jewelry',
    description: 'Filigree and metalwork',
  },
];

export function CraftWorkshops() {
  return (
    <section className="py-20 bg-brand-cream/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
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

            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-brand-orange" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Craft Types */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {crafts.map((craft, index) => (
                <div key={index} className="text-center">
                  <div className="h-12 w-12 mx-auto rounded-xl bg-brand-orange/10 flex items-center justify-center mb-2">
                    <craft.icon className="h-6 w-6 text-brand-orange" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{craft.name}</h4>
                  <p className="text-xs text-gray-500">{craft.description}</p>
                </div>
              ))}
            </div>

            <Link href="/tours?category=workshops">
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
              >
                View All Workshops
              </Button>
            </Link>
          </div>

          {/* Right: Large Image */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=1000&fit=crop"
                alt="Craftsman working on pottery"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-xs">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-brand-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏺</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">200+ Workshops</p>
                  <p className="text-sm text-gray-500">Across 5 cities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
