export default function BlogSection() {
  const posts = [
    {
      image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400&q=80',
      category: 'DESTINATIONS',
      title: 'Top 7 Must-Visit Places in Uzbekistan',
      excerpt: 'Discover the hidden gems and iconic landmarks of Uzbekistan, from ancient Silk Road cities to mountain villages.',
      date: 'Dec 15',
      readTime: '8 min read',
    },
    {
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80',
      category: 'CRAFTS',
      title: 'A Culinary Journey Through Uzbekistan: Must-Try Dishes',
      excerpt: 'From plov to samsa, explore the rich culinary traditions that make Uzbek cuisine unforgettable.',
      date: 'Dec 10',
      readTime: '6 min read',
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      category: 'HISTORY',
      title: 'The Silk Road: Uzbekistan\'s Golden Age of Trade and...',
      excerpt: 'Journey back in time to when Uzbekistan was the crossroads of the ancient Silk Road trading route.',
      date: 'Dec 5',
      readTime: '10 min read',
    },
  ];

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold mb-2">JAHONGIR TRAVEL BLOG</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Plan Your Craft Workshop Journey</h2>
          <p className="text-gray-600">
            Useful resources, trip planning tips, and behind-the-scenes stories from Uzbekistan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <span className="text-orange-500 text-xs font-semibold">{post.category}</span>
                <h3 className="font-bold text-gray-900 mt-2 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center text-gray-400 text-sm">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="text-orange-500 hover:text-orange-600 font-semibold">
            Read More Inspiring Stories →
          </button>
        </div>
      </div>
    </section>
  );
}
