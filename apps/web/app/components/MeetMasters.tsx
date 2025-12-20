export default function MeetMasters() {
  const masters = [
    {
      name: 'Abdulvahid Narzullaev',
      craft: 'Master Ceramicist',
      location: 'Rishtan, Fergana Valley',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
      description: 'Following the tradition of the renowned Rishtan pottery school.',
    },
    {
      name: 'Yulduzkhon Silk Factory',
      craft: 'Traditional Silk Weaving',
      location: 'Margilan, Fergana Valley',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
      description: 'UNESCO recognized silk ikat weaving traditions.',
    },
    {
      name: 'Saodat Embroidery Masters',
      craft: 'Suzani & Gold Embroidery',
      location: 'Bukhara',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
      description: 'Traditional Bukharan embroidery techniques.',
    },
    {
      name: 'Mirshukur Wood Workshop',
      craft: 'Ornamental Wood Carving',
      location: 'Khiva',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
      description: 'Ancient patterns and techniques of Khorezmian masters.',
    },
  ];

  const additionalMasters = [
    { name: 'Tilla Pottery', location: 'Samarkand' },
    { name: 'Joss Silk Workshop', location: 'Margilan' },
    { name: 'The Calligraphy Center', location: 'Bukhara' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold mb-2">THE ARTISANS</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet the Masters</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn from artisans who have dedicated their lives to preserving and sharing their ancestral crafts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {masters.map((master, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={master.image}
                  alt={master.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{master.name}</h3>
                <p className="text-orange-500 text-sm font-medium">{master.craft}</p>
                <p className="text-gray-500 text-sm mt-1">{master.location}</p>
                <p className="text-gray-600 text-sm mt-2">{master.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Masters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {additionalMasters.map((master, index) => (
            <div key={index} className="bg-white px-4 py-2 rounded-full border border-gray-200 text-sm">
              <span className="font-medium text-gray-900">{master.name}</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-gray-500">{master.location}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View All Our Masters
          </button>
        </div>
      </div>
    </section>
  );
}
