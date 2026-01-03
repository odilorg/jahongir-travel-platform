'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Do I need any prior craft experience to join a workshop?',
    answer:
      'No experience is needed! Our workshops are designed for all skill levels. Master artisans will guide you through every step, from basic techniques to creating your finished piece. Beginners are especially welcome.',
  },
  {
    question: 'What can I expect to create during a workshop?',
    answer:
      'Depending on the workshop, you might create a hand-painted ceramic bowl, a silk embroidered textile, a piece of jewelry, or a wooden carving. All materials are provided, and you take home everything you create.',
  },
  {
    question: 'How long do the craft workshops last?',
    answer:
      'Workshop durations vary from 2-hour introductory sessions to full-day intensive experiences. We also offer multi-day programs for those wanting deeper immersion. Check each tour for specific timing.',
  },
  {
    question: 'Are workshops suitable for children?',
    answer:
      'Many of our workshops welcome families with children aged 10 and above. We have special family-friendly sessions where kids can try simpler crafts while adults work on more complex projects. Please inquire about specific workshops.',
  },
  {
    question: 'What should I wear or bring to a workshop?',
    answer:
      'Wear comfortable clothes that you don\'t mind getting a bit dirty. All tools, materials, and protective equipment (aprons, etc.) are provided. Just bring your enthusiasm and a camera for photos!',
  },
  {
    question: 'Can I visit the artisan workshops without participating?',
    answer:
      'Yes! We offer observation-only visits for those who prefer to watch and learn without hands-on participation. These tours are perfect for photographers or those short on time.',
  },
  {
    question: 'How do I book a craft workshop tour?',
    answer:
      'You can browse our workshop tours on this website and book online. For custom experiences or group bookings, contact us directly and we\'ll create a personalized itinerary for you.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Everything You Need to Know About Our Craft Workshops
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We've got answers. If you can't find what you're looking
            for, don't hesitate to contact us.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-brand-orange" />
                  </div>
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-brand-orange flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 pl-18">
                  <div className="pl-12 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="mailto:info@jahongirtravel.com"
            className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:underline"
          >
            Contact us at info@jahongirtravel.com
          </a>
        </div>
      </div>
    </section>
  );
}
