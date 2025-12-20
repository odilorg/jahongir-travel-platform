import {
  Palette,
  Users,
  Award,
  Clock,
  Shield,
  Heart,
  Camera,
  Gift,
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Hands-On Experience',
    description: 'Create your own crafts under the guidance of master artisans',
  },
  {
    icon: Users,
    title: 'Small Groups',
    description: 'Maximum 8 participants for personalized attention',
  },
  {
    icon: Award,
    title: 'Expert Masters',
    description: 'Learn from artisans with 20-40 years of experience',
  },
  {
    icon: Clock,
    title: 'Flexible Duration',
    description: 'Half-day to multi-week immersive programs',
  },
  {
    icon: Shield,
    title: 'All-Inclusive',
    description: 'Materials, tools, and instruction included',
  },
  {
    icon: Heart,
    title: 'Authentic Locations',
    description: 'Real working ateliers, not tourist setups',
  },
  {
    icon: Camera,
    title: 'Photo Opportunities',
    description: 'Capture your journey with stunning backdrops',
  },
  {
    icon: Gift,
    title: 'Take Home Crafts',
    description: 'Keep everything you create as unique souvenirs',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Is This Experience Right for You?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're a beginner curious about crafts or an experienced artisan
            seeking new skills, our workshops welcome all
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-amber-50 border border-amber-100 p-6 rounded-xl hover:shadow-lg hover:border-amber-200 transition-all duration-300 group"
            >
              <div className="h-14 w-14 rounded-full bg-brand-orange/20 flex items-center justify-center mb-4">
                <feature.icon className="h-7 w-7 text-brand-orange" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
