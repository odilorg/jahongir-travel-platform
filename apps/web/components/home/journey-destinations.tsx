import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

const destinations = [
  {
    name: 'Samarkand',
    slug: 'samarkand',
    description: 'Ancient capital of the Silk Road with stunning Registan Square',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop',
    workshops: 12,
  },
  {
    name: 'Bukhara',
    slug: 'bukhara',
    description: 'Living museum of Islamic architecture and textile crafts',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop',
    workshops: 15,
  },
  {
    name: 'Khiva',
    slug: 'khiva',
    description: 'Preserved medieval city famous for woodcarving',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop',
    workshops: 8,
  },
  {
    name: 'Margilan',
    slug: 'margilan',
    description: 'Heart of Uzbek silk production and ikat weaving',
    image: 'https://images.unsplash.com/photo-1513415277900-79fd9c61a4f5?w=600&h=400&fit=crop',
    workshops: 10,
  },
];

export function JourneyDestinations() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
            Destinations
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Plan Your Craft Workshop Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the legendary cities of the Silk Road and discover their unique
            craft traditions
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Link
              key={index}
              href={`/tours?city=${destination.slug}`}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden">
                {/* Background Image */}
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{destination.workshops} workshops</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {destination.description}
                  </p>
                  <div className="flex items-center gap-2 text-brand-orange font-medium group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
