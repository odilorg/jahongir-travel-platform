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
    <section className="py-20 bg-brand-cream/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Is This Right for You?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're a beginner curious about crafts or an experienced artisan
            seeking new skills, our workshops welcome all
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-brand-orange/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                <feature.icon className="h-6 w-6 text-brand-orange group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
