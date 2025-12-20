export default function Reviews() {
  const reviews = [
    {
      name: 'Sarah Mitchell',
      location: 'London, United Kingdom',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      rating: 5,
      title: 'Terrific locale. Amazing pottery workshop.',
      text: 'I spent half a day at Mr. Alisher\'s pottery workshop learning to throw pots on the wheel. His patience was incredible, and I made a bowl I\'m still using. The tea and hospitality were wonderful. Highly recommend!',
    },
    {
      name: 'Michael Chen',
      location: 'San Francisco, USA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      rating: 5,
      title: 'Professional & knowledgeable',
      text: 'Our guide knew so much about traditional silk-weaving. Watching the artisans work was mesmerizing, and getting to try the loom myself was unforgettable. Worth every penny.',
    },
    {
      name: 'Anna Schmidt',
      location: 'Berlin, Germany',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      rating: 5,
      title: 'Warm, friendly. Best experience.',
      text: 'Jahongir\'s team arranged an amazing day learning suzani embroidery. The master was patient, the setting was beautiful, and I came away with a piece I made with my own hands.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold mb-2">TESTIMONIALS</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Traveller Reviews</h2>
          <p className="text-gray-600">
            What travelers say about their craft workshop experiences with us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-gray-500 text-sm">{review.location}</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-600 text-sm">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
