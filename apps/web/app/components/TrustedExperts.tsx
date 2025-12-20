export default function TrustedExperts() {
  const features = [
    'Full-day hands-on workshops',
    'Access to hidden gems (most tourists miss)',
    'English-speaking guides + artisan guides',
    'Flexible booking: reschedule, refund, private groups',
    'Unique souvenirs: pottery, silk, wood carvings',
    'Authentic Uzbek tea and hospitality',
    'Help with visa + Uzbekistan logistics',
    'Keep your handmade pieces',
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <p className="text-orange-500 font-semibold mb-2">WHY CHOOSE US</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted Local Experts<br />in Uzbekistan
            </h2>
            <p className="text-gray-600 mb-6">
              We're a family-owned travel company based in Samarkand, running craft-focused tours since 2015.
              We connect you with the best artisan workshops and cultural experiences across Uzbekistan.
            </p>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-gray-600">5.0</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">50+ Tripadvisor Reviews</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">120+ workshops hosted in 2024</span>
            </div>

            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors mb-8">
              See 2025 Craft Workshops &rarr;
            </button>

            {/* Pricing Card */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-500 text-sm mb-2">Looking for a full-day, hands-on workshop?</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-gray-900">$90</span>
                <span className="text-gray-500">USD / per person</span>
              </div>
              <ul className="space-y-2 text-gray-600 text-sm">
                {features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-4">The price is $90, +$30 for a comprehensive tour</p>
            </div>
          </div>

          {/* Right Content - Features */}
          <div>
            <div className="bg-orange-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What's included in your workshop:</h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info Cards */}
            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">📍</span> Local Experience
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Visit actual artisan workshops, not tourist shows. Every master we work with is a practicing artisan.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">🎨</span> Self-Teaching Approach
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Learn at your own pace with guidance. Our masters adjust techniques to help you succeed, not just watch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
