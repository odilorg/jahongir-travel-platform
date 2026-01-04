'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Check,
  Play
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

interface ModernItineraryProps {
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

export function ModernItinerary({ items, translations }: ModernItineraryProps) {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleDay = (day: number) => {
    setActiveDay(day);
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

  const getMealIcons = (meals?: string) => {
    if (!meals || typeof meals !== 'string') return null;
    const mealsLower = meals.toLowerCase();
    const icons = [];
    if (mealsLower.includes('breakfast') || mealsLower.includes('b') || mealsLower.includes('завтрак') || mealsLower.includes('nonushta')) {
      icons.push({ icon: Sunrise, label: 'Breakfast', color: 'text-amber-500' });
    }
    if (mealsLower.includes('lunch') || mealsLower.includes('l') || mealsLower.includes('обед') || mealsLower.includes('tushlik')) {
      icons.push({ icon: Sun, label: 'Lunch', color: 'text-orange-500' });
    }
    if (mealsLower.includes('dinner') || mealsLower.includes('d') || mealsLower.includes('ужин') || mealsLower.includes('kechki')) {
      icons.push({ icon: Moon, label: 'Dinner', color: 'text-indigo-500' });
    }
    return icons.length > 0 ? icons : null;
  };

  // Auto-play through days
  const startAutoPlay = () => {
    setIsPlaying(true);
    let currentDay = 1;
    const interval = setInterval(() => {
      currentDay++;
      if (currentDay > items.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setActiveDay(1);
      } else {
        setActiveDay(currentDay);
      }
    }, 3000);
  };

  return (
    <div className="w-full">
      {/* Desktop Interactive Timeline View */}
      <div className="hidden lg:block">
        {/* Timeline Container */}
        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">

          {/* Auto-play Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={startAutoPlay}
              disabled={isPlaying}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                isPlaying
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
              )}
            >
              <Play className="w-4 h-4" />
              {isPlaying ? 'Playing...' : 'Auto Play'}
            </button>
          </div>

          {/* Timeline Header - Horizontal Days with Icons */}
          <div className="relative mb-10 mt-4">
            {/* Background Connection Line */}
            <div className="absolute top-8 left-[4%] right-[4%] h-1 bg-gray-200 rounded-full" />

            {/* Animated Progress Line */}
            <motion.div
              className="absolute top-8 left-[4%] h-1 bg-gradient-to-r from-primary via-primary to-primary/60 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((activeDay - 1) / (items.length - 1)) * 92}%`
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {/* Day Nodes */}
            <div className="relative flex justify-between px-[2%]">
              {items.map((item) => {
                const DayIcon = getDayIcon(item.title, item.description);
                const isActive = activeDay === item.day;
                const isPast = item.day < activeDay;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveDay(item.day)}
                    className="flex flex-col items-center group relative"
                  >
                    {/* Icon Circle */}
                    <motion.div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-3 relative z-10",
                        isActive
                          ? "bg-primary text-white border-primary shadow-xl shadow-primary/30"
                          : isPast
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-white text-gray-400 border-gray-200 hover:border-primary/50 hover:text-primary hover:shadow-lg"
                      )}
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {isPast ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <DayIcon className="w-6 h-6" />
                      )}

                      {/* Pulse animation for active */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/30"
                          animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>

                    {/* Day Number Badge */}
                    <motion.div
                      className={cn(
                        "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-20",
                        isActive
                          ? "bg-white text-primary shadow-md"
                          : isPast
                          ? "bg-primary/20 text-primary"
                          : "bg-gray-100 text-gray-500"
                      )}
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    >
                      {item.day}
                    </motion.div>

                    {/* Day Label */}
                    <span className={cn(
                      "mt-3 text-sm font-semibold transition-colors",
                      isActive ? "text-primary" : "text-gray-500"
                    )}>
                      {translations.day} {item.day}
                    </span>

                    {/* Title Preview */}
                    <span className={cn(
                      "mt-1 text-xs max-w-[90px] text-center line-clamp-2 transition-colors leading-tight",
                      isActive ? "text-gray-900 font-medium" : "text-gray-400"
                    )}>
                      {item.title.split(':')[0].split('-')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Day Content Card */}
          <AnimatePresence mode="wait">
            {items.filter(item => item.day === activeDay).map((item) => {
              const DayIcon = getDayIcon(item.title, item.description);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="grid grid-cols-5 gap-0">
                    {/* Left: Image/Gradient Section */}
                    <div className="col-span-2 relative min-h-[350px]">
                      {item.image ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60" />
                      )}

                      {/* Overlay Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                        {/* Top Badge */}
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                            <DayIcon className="w-5 h-5" />
                            <span className="font-bold">{translations.day} {item.day}</span>
                          </div>
                        </div>

                        {/* Bottom Info */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm opacity-90">
                              {item.title.includes(':') ? item.title.split(':')[0] : 'Uzbekistan'}
                            </span>
                          </div>
                          {item.accommodation && (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                              <Bed className="w-4 h-4" />
                              <span className="text-sm">{item.accommodation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Content Section */}
                    <div className="col-span-3 p-8">
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {item.description}
                      </p>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Accommodation Card */}
                        {item.accommodation && (
                          <motion.div
                            className="bg-blue-50 rounded-xl p-4 flex items-start gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Bed className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <span className="text-xs text-blue-600 uppercase tracking-wide font-semibold">
                                {translations.accommodation}
                              </span>
                              <p className="text-sm font-medium text-gray-900 mt-0.5">{item.accommodation}</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Meals Card */}
                        {item.meals && (
                          <motion.div
                            className="bg-orange-50 rounded-xl p-4 flex items-start gap-3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <Utensils className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <span className="text-xs text-orange-600 uppercase tracking-wide font-semibold">
                                {translations.meals}
                              </span>
                              <div className="flex items-center gap-1.5 mt-1">
                                {getMealIcons(item.meals)?.map((meal, idx) => (
                                  <div
                                    key={idx}
                                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"
                                    title={meal.label}
                                  >
                                    <meal.icon className={cn("w-4 h-4", meal.color)} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setActiveDay(Math.max(1, activeDay - 1))}
              disabled={activeDay === 1}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all",
                activeDay === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-primary hover:text-white shadow-md hover:shadow-lg"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Day Indicators */}
            <div className="flex gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveDay(item.day)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    activeDay === item.day
                      ? "bg-primary w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveDay(Math.min(items.length, activeDay + 1))}
              disabled={activeDay === items.length}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all",
                activeDay === items.length
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-primary hover:text-white shadow-md hover:shadow-lg"
              )}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Accordion View */}
      <div className="lg:hidden">
        {/* Mobile Progress Bar */}
        <div className="mb-4 px-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              {translations.day} 1 - {items.length}
            </span>
            <button
              onClick={() => {
                if (expandedDays.size === items.length) {
                  setExpandedDays(new Set([1]));
                } else {
                  setExpandedDays(new Set(items.map(i => i.day)));
                }
              }}
              className="text-sm text-primary font-medium"
            >
              {expandedDays.size === items.length ? translations.hideDetails : translations.viewDetails}
            </button>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all",
                  expandedDays.has(item.day) ? "bg-primary" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const DayIcon = getDayIcon(item.title, item.description);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleDay(item.day)}
                  className="w-full p-4 flex items-center gap-4 text-left"
                >
                  {/* Day Circle with Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                    expandedDays.has(item.day)
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary"
                  )}>
                    <DayIcon className="w-5 h-5" />
                  </div>

                  {/* Title & Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {translations.day} {item.day}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate mt-1">{item.title}</h3>
                    {!expandedDays.has(item.day) && (
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {item.description.substring(0, 50)}...
                      </p>
                    )}
                  </div>

                  {/* Expand Icon */}
                  <motion.div
                    animate={{ rotate: expandedDays.has(item.day) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {expandedDays.has(item.day) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4">
                        {/* Image */}
                        {item.image && (
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>

                        {/* Info Pills */}
                        <div className="flex flex-wrap gap-2">
                          {item.accommodation && (
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1.5 text-sm">
                              <Bed className="w-4 h-4" />
                              <span>{item.accommodation}</span>
                            </div>
                          )}
                          {item.meals && (
                            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 rounded-full px-3 py-1.5 text-sm">
                              <Utensils className="w-4 h-4" />
                              <span>{item.meals}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
