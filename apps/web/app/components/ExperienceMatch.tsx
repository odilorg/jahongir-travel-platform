export default function ExperienceMatch() {
  const perfectFor = [
    'You want authentic, hands-on cultural experiences',
    'You prefer small groups over big tourist buses',
    'You value cultural depth over big attractions',
    'You\'re looking for meaningful souvenirs (made by you!)',
  ];

  const notIdeal = [
    'You prefer large group tours with 20+ people',
    'You want a typical city tour with 100+ people',
    'You\'re looking for luxury 5-star experiences',
    'You need everything planned minute-by-minute',
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Is This Experience Right for You?</h2>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">✓</span> Perfect For You If...
              </h3>
              <ul className="space-y-3">
                {perfectFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">✗</span> Not Ideal If...
              </h3>
              <ul className="space-y-3">
                {notIdeal.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Still unsure? <a href="/contact" className="text-orange-500 hover:underline">Chat with us</a> —
          We're happy to answer any questions or recommend the best crafts for your interests.
        </p>
      </div>
    </section>
  );
}
