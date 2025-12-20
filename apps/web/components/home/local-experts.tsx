import { Check } from 'lucide-react';
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
    <section className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Stats + Images */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-amber-50 border border-amber-100 p-6 rounded-xl text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=500&h=375&fit=crop"
                  alt="Samarkand architecture"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1548013146-72479768bada?w=500&h=375&fit=crop"
                  alt="Taj Mahal"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-xl col-span-2">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
                  alt="Thailand landmark"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div>
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Trusted Local Experts in Uzbekistan's Legendary Destinations
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              We connect you with the heart of Uzbekistan through authentic
              experiences and expert guidance.
            </p>

            <ul className="space-y-4 mb-8">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-gray-700 text-base">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/tours">
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-8"
              >
                Explore Our Tours
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
