'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface TourFAQProps {
  faqs: FAQItem[];
  title?: string;
  className?: string;
}

// ============================================
// FAQ ACCORDION ITEM
// ============================================

function FAQAccordionItem({
  item,
  isOpen,
  onToggle
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-3 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise focus-visible:ring-offset-2 rounded-lg"
        aria-expanded={isOpen}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors mt-0.5",
          isOpen ? "bg-brand-turquoise text-white" : "bg-gray-100 text-gray-500"
        )}>
          <HelpCircle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <span className={cn(
            "font-medium text-base transition-colors",
            isOpen ? "text-brand-turquoise" : "text-gray-900"
          )}>
            {item.question}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 mt-1",
            isOpen && "rotate-180 text-brand-turquoise"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pl-11 pr-4 pb-4">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function TourFAQ({ faqs, title, className }: TourFAQProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-white rounded-xl shadow-sm p-5 sm:p-6", className)}>
      {title && (
        <h2 className="relative pl-4 text-xl sm:text-2xl font-bold text-gray-900 mb-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-[hsl(var(--brand-turquoise))] before:to-[hsl(var(--brand-gold))]">
          {title}
        </h2>
      )}
      <div className="divide-y divide-gray-100">
        {faqs.map((faq) => (
          <FAQAccordionItem
            key={faq.id}
            item={faq}
            isOpen={openItems.has(faq.id)}
            onToggle={() => toggleItem(faq.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// MOCK DATA GENERATOR
// ============================================

export function generateMockFAQs(): FAQItem[] {
  return [
    {
      id: 'faq-1',
      question: 'What is the best time to visit Uzbekistan?',
      answer: 'The best time to visit Uzbekistan is during spring (April-May) and autumn (September-October) when temperatures are mild and comfortable for sightseeing. Summer can be very hot (up to 40°C) while winter is cold with occasional snow.'
    },
    {
      id: 'faq-2',
      question: 'Do I need a visa to visit Uzbekistan?',
      answer: 'Citizens of over 90 countries can visit Uzbekistan visa-free for up to 30 days. This includes most EU countries, USA, UK, Canada, Australia, and many others. Check with your local Uzbekistan embassy for the most current information.'
    },
    {
      id: 'faq-3',
      question: 'What is the group size for this tour?',
      answer: 'Our tours typically have a maximum of 12 participants to ensure a personalized experience. For private tours, you can travel with as few as 2 people. Minimum group size for guaranteed departures is usually 4 participants.'
    },
    {
      id: 'faq-4',
      question: 'What should I pack for the tour?',
      answer: 'We recommend comfortable walking shoes, modest clothing for mosque visits (covered shoulders and knees), sunscreen, a hat, and layers as temperatures can vary. In spring/autumn, bring a light jacket for evenings. In summer, light breathable clothing is essential.'
    },
    {
      id: 'faq-5',
      question: 'Are meals included in the tour?',
      answer: 'Most tours include daily breakfast at hotels. Lunch and dinner are typically not included to give you flexibility to explore local cuisine. However, we provide restaurant recommendations and can arrange group dinners upon request.'
    },
    {
      id: 'faq-6',
      question: 'What is the cancellation policy?',
      answer: 'Free cancellation up to 30 days before departure for a full refund. 15-29 days before: 50% refund. Less than 15 days: no refund. We recommend travel insurance for unexpected circumstances.'
    }
  ];
}
