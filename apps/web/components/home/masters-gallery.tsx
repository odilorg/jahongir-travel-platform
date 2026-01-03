const masters = [
  {
    name: 'Usman Umarov',
    craft: 'Master Potter',
    city: 'Rishton',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    experience: '40 years',
  },
  {
    name: 'Dilorom Karimova',
    craft: 'Silk Embroiderer',
    city: 'Bukhara',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
    experience: '25 years',
  },
  {
    name: 'Bahrom Turaev',
    craft: 'Woodcarver',
    city: 'Khiva',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    experience: '35 years',
  },
  {
    name: 'Malika Rahimova',
    craft: 'Jewelry Maker',
    city: 'Samarkand',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    experience: '20 years',
  },
  {
    name: 'Aziz Mahmudov',
    craft: 'Carpet Weaver',
    city: 'Margilan',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    experience: '30 years',
  },
];

export function MastersGallery() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
            Our Artisans
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Meet the Masters
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn directly from artisans who have dedicated their lives to preserving
            Uzbekistan's rich craft heritage
          </p>
        </div>

        {/* Masters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {masters.map((master, index) => (
            <div key={index} className="text-center group cursor-pointer">
              {/* Circular Image */}
              <div className="relative mx-auto mb-4">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto ring-4 ring-brand-cream group-hover:ring-brand-orange transition-all duration-300">
                  <img
                    src={master.image}
                    alt={master.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Experience Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                  {master.experience}
                </div>
              </div>

              {/* Info */}
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                {master.name}
              </h3>
              <p className="text-brand-orange text-sm font-medium">{master.craft}</p>
              <p className="text-gray-500 text-xs">{master.city}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
