// Re-export from new modular structure
// This file maintains backward compatibility with existing imports
// The form has been split into smaller components for better performance
// See: ./tour-form/ directory for individual tab components

export { TourForm } from './tour-form';
export type {
  TourFormProps,
  TourFormData,
  TourDeparture,
  PricingTier,
  FAQItem,
  Category,
} from './tour-form';
