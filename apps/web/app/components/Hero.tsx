export default function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-r from-amber-800 to-orange-700">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        <p className="text-orange-400 text-lg mb-4 tracking-wide">CRAFT WORKSHOPS IN UZBEKISTAN</p>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Live the Craft. Meet the Masters.<br />
          Preserve the Tradition.
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Hands-on craft workshops with master artisans in Samarkand, Bukhara, Khiva, and beyond —
          learn traditional crafts passed down through generations.
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-full p-2 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 shadow-lg">
          <div className="flex-1 flex items-center px-4">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search your destination"
              className="w-full py-2 outline-none text-gray-700"
            />
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            View Craft Workshops &rarr;
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Family Owned</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>UNESCO Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100+ Happy Visitors</span>
          </div>
        </div>
      </div>
    </section>
  );
}
