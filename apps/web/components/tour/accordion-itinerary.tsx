'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  MapPin,
  Bed,
  Utensils,
  Camera,
  Mountain,
  Building2,
  Landmark,
  Plane,
  Car,
  Sun,
  Moon,
  Sunrise,
  Clock,
  Check,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItineraryItem {
  id: string;
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
  image?: string;
}

interface AccordionItineraryProps {
  items: ItineraryItem[];
  translations: {
    day: string;
    itinerary: string;
    accommodation: string;
    meals: string;
    viewDetails: string;
    hideDetails: string;
  };
}

// Get icon based on day title/description keywords
const getDayIcon = (title: string, description: string) => {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('arrival') || text.includes('прибытие') || text.includes('kelish') || text.includes('airport') || text.includes('аэропорт')) {
    return Plane;
  }
  if (text.includes('mountain') || text.includes('trekking') || text.includes('hiking') || text.includes('горы') || text.includes('tog\'')) {
    return Mountain;
  }
  if (text.includes('mosque') || text.includes('madrasa') || text.includes('registan') || text.includes('мечеть') || text.includes('медресе') || text.includes('masjid')) {
    return Landmark;
  }
  if (text.includes('museum') || text.includes('palace') || text.includes('музей') || text.includes('дворец') || text.includes('saroy')) {
    return Building2;
  }
  if (text.includes('photo') || text.includes('sightseeing') || text.includes('tour') || text.includes('фото') || text.includes('экскурсия')) {
    return Camera;
  }
  if (text.includes('transfer') || text.includes('drive') || text.includes('трансфер') || text.includes('поездка')) {
    return Car;
  }
  return MapPin;
};

// Get gradient color based on day number
const getDayGradient = (day: number) => {
  const gradients = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-cyan-500 to-cyan-600',
    'from-amber-500 to-amber-600',
    'from-indigo-500 to-indigo-600',
  ];
  return gradients[(day - 1) % gradients.length];
};

export function AccordionItinerary({ items, translations }: AccordionItineraryProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  const toggleDay = (day: number) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedDays(new Set(items.map(i => i.day)));
  };

  const collapseAll = () => {
    setExpandedDays(new Set());
  };

  const getMealIcons = (meals?: string) => {
    if (!meals || typeof meals !== 'string') return null;
    const mealsLower = meals.toLowerCase();
    const icons = [];
    if (mealsLower.includes('breakfast') || mealsLower.includes('b') || mealsLower.includes('завтрак') || mealsLower.includes('nonushta')) {
      icons.push({ icon: Sunrise, label: 'B', color: 'bg-amber-100 text-amber-600' });
    }
    if (mealsLower.includes('lunch') || mealsLower.includes('l') || mealsLower.includes('обед') || mealsLower.includes('tushlik')) {
      icons.push({ icon: Sun, label: 'L', color: 'bg-orange-100 text-orange-600' });
    }
    if (mealsLower.includes('dinner') || mealsLower.includes('d') || mealsLower.includes('ужин') || mealsLower.includes('kechki')) {
      icons.push({ icon: Moon, label: 'D', color: 'bg-indigo-100 text-indigo-600' });
    }
    return icons.length > 0 ? icons : null;
  };

  return (
    <div className="w-full">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{items.length} {(translations.day || 'day').toLowerCase()}s</span>
          </div>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1" aria-hidden="true">
            {items.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  expandedDays.has(idx + 1) ? "bg-brand-turquoise" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={expandAll}
            className="text-xs sm:text-sm text-brand-turquoise hover:text-brand-turquoise/80 font-medium transition-colors focus-ring rounded px-1"
            aria-label={`${translations.viewDetails} - expand all days`}
          >
            {translations.viewDetails}
          </button>
          <span className="text-gray-300 text-xs sm:text-sm" aria-hidden="true">|</span>
          <button
            onClick={collapseAll}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors focus-ring rounded px-1"
            aria-label={`${translations.hideDetails} - collapse all days`}
          >
            {translations.hideDetails}
          </button>
        </div>
      </div>

      {/* Accordion Items */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const DayIcon = getDayIcon(item.title, item.description);
          const isExpanded = expandedDays.has(item.day);
          const gradient = getDayGradient(item.day);
          const mealIcons = getMealIcons(item.meals);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "rounded-2xl overflow-hidden transition-all duration-300",
                isExpanded
                  ? "bg-white shadow-lg ring-1 ring-gray-100"
                  : "bg-white shadow-sm hover:shadow-md ring-1 ring-gray-100"
              )}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleDay(item.day)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDay(item.day);
                  }
                }}
                className="w-full text-left focus-ring rounded-2xl"
                aria-expanded={isExpanded}
                aria-controls={`day-${item.day}-content`}
                id={`day-${item.day}-header`}
              >
                <div className="flex items-stretch">
                  {/* Day Badge - Colored sidebar */}
                  <div className={cn(
                    "w-16 sm:w-20 md:w-24 flex-shrink-0 bg-gradient-to-br flex flex-col items-center justify-center py-3 sm:py-4 text-white",
                    gradient
                  )}>
                    <span className="text-[10px] sm:text-xs font-medium opacity-80">{translations.day}</span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold">{item.day}</span>
                    <DayIcon className="w-4 h-4 sm:w-5 sm:h-5 mt-1 opacity-80" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 sm:p-4 md:p-5 flex items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title - wraps on mobile */}
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg leading-tight line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Preview - only when collapsed, hidden on small mobile */}
                      {!isExpanded && (
                        <p className="hidden sm:block text-sm text-gray-500 mt-1 line-clamp-1">
                          {item.description.substring(0, 80)}...
                        </p>
                      )}

                      {/* Quick info badges - always visible */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
                        {item.accommodation && (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-1.5 sm:px-2 py-0.5 rounded-full">
                            <Bed className="w-3 h-3" />
                            <span className="hidden sm:inline truncate max-w-[100px]">{item.accommodation}</span>
                            <span className="sm:hidden">Hotel</span>
                          </span>
                        )}
                        {mealIcons && (
                          <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-600 px-1.5 sm:px-2 py-0.5 rounded-full">
                            <Utensils className="w-3 h-3" />
                            {mealIcons.map((meal, idx) => (
                              <span key={idx} className="font-medium">{meal.label}</span>
                            ))}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand/Collapse Icon - always visible */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors mt-0.5",
                        isExpanded ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
                      )}
                    >
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                    id={`day-${item.day}-content`}
                    role="region"
                    aria-labelledby={`day-${item.day}-header`}
                  >
                    <div className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-0">
                      {/* Divider */}
                      <div className="border-t border-gray-100 mb-4 sm:mb-5" />

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                        {/* Image (if available) */}
                        {item.image && (
                          <div className="lg:col-span-1">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        <div className={cn(
                          "space-y-3 sm:space-y-4",
                          item.image ? "lg:col-span-2" : "lg:col-span-3"
                        )}>
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Detailed Info Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                            {item.accommodation && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center gap-2.5 sm:gap-3 bg-blue-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3"
                              >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[10px] sm:text-xs text-blue-600 font-medium uppercase tracking-wide">
                                    {translations.accommodation}
                                  </span>
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                    {item.accommodation}
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            {item.meals && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="flex items-center gap-2.5 sm:gap-3 bg-orange-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3"
                              >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                  <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-[10px] sm:text-xs text-orange-600 font-medium uppercase tracking-wide">
                                    {translations.meals}
                                  </span>
                                  <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                                    {mealIcons?.map((meal, idx) => (
                                      <div
                                        key={idx}
                                        className={cn(
                                          "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center",
                                          meal.color
                                        )}
                                        title={meal.label}
                                      >
                                        <meal.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                      </div>
                                    ))}
                                    {!mealIcons && (
                                      <span className="text-xs sm:text-sm text-gray-600">{item.meals}</span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Navigation Hint */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-400">
          Tap each day to {expandedDays.size > 0 ? 'collapse' : 'expand'} details
        </p>
      </div>
    </div>
  );
}
