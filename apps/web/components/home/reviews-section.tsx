import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The pottery workshop in Rishton was the highlight of our trip! Learning from a master craftsman who has been perfecting his art for 40 years was incredible.',
    tour: 'Silk Road Craft Workshop Tour',
  },
  {
    name: 'Michael Chen',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Jahongir Travel organized everything perfectly. The guides were knowledgeable and the workshops were authentic - not tourist shows but real working ateliers.',
    tour: 'Bukhara Embroidery Experience',
  },
  {
    name: 'Emma Williams',
    location: 'Sydney, Australia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'I came home with not just souvenirs, but skills! The suzani embroidery I created is now hanging in my living room. Thank you for this amazing experience.',
    tour: 'Complete Uzbekistan Craft Tour',
  },
  {
    name: 'Hans Mueller',
    location: 'Berlin, Germany',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The attention to detail and personal care from the team was exceptional. Every workshop was well-organized and the masters were patient and inspiring.',
    tour: 'Samarkand Ceramic Workshop',
  },
];

export function ReviewsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Traveler Reviews
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from travelers who have experienced our craft workshops firsthand
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-brand-orange/30 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">"{review.text}"</p>

              {/* Tour Name */}
              <p className="text-sm text-brand-orange font-medium mb-4">
                {review.tour}
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
