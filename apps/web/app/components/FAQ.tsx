'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Do I need prior craft experience to join a workshop?',
      answer: 'Not at all! Our workshops are designed for all skill levels, from complete beginners to experienced crafters. Our master artisans will guide you through every step, adjusting their teaching to your pace and experience.',
    },
    {
      question: 'Are workshops suitable for children?',
      answer: 'Yes, most of our workshops welcome children aged 8 and above when accompanied by an adult. Pottery and paper-making are particularly popular with families. Let us know if you\'re traveling with children and we\'ll recommend the best options.',
    },
    {
      question: 'What languages are workshops conducted in?',
      answer: 'All workshops include an English-speaking guide who will translate for the artisan master. We can also arrange guides in Russian, German, French, and other languages upon request.',
    },
    {
      question: 'Can I book a private workshop for my group?',
      answer: 'Absolutely! We offer private workshops for couples, families, and groups of any size. Private workshops can be customized to your interests and schedule. Contact us for pricing and availability.',
    },
    {
      question: 'What\'s included in the workshop price?',
      answer: 'All workshop fees include: hands-on instruction with a master artisan, all materials and tools, traditional Uzbek tea and snacks, an English-speaking guide, and of course, you get to keep everything you make!',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'We offer flexible cancellation: full refund up to 48 hours before your workshop, 50% refund within 24-48 hours. We can also reschedule at no extra charge if you give us at least 24 hours notice.',
    },
  ];

  return (
    <section className="py-20 bg-teal-700">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-teal-300 font-semibold mb-2">FREQUENTLY ASKED QUESTIONS</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Know About Our<br />Craft Workshops
          </h2>
          <p className="text-teal-100">
            Planning your first craft workshop in Uzbekistan? Here are answers to the most common questions
            to help you prepare.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur rounded-xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-teal-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white mb-4">Still have questions? We're here to help!</p>
          <button className="bg-white text-teal-700 hover:bg-teal-50 px-8 py-3 rounded-lg font-semibold transition-colors">
            Contact Us Today
          </button>
        </div>
      </div>
    </section>
  );
}
