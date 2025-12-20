export default function ArtisanCrafts() {
  const crafts = [
    {
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80',
      title: 'Ceramic & Pottery',
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      title: 'Silk Weaving',
    },
    {
      image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400&q=80',
      title: 'Wood Carving',
    },
    {
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
      title: 'Suzani Embroidery',
    },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-orange-400 font-semibold mb-2">AUTHENTIC CRAFTSMANSHIP</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Master Ancient Uzbek Crafts From<br />Award-Winning Artisans
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Learn centuries-old techniques directly from master craftspeople whose families
            have preserved these traditions for generations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {crafts.map((craft, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl aspect-square">
              <img
                src={craft.image}
                alt={craft.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg">{craft.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Explore 2025 Workshop Calendar
          </button>
        </div>
      </div>
    </section>
  );
}
