import {
  HeroBanner,
  LocalExperts,
  CraftWorkshops,
  MastersGallery,
  ReviewsSection,
  JourneyDestinations,
  FeaturesGrid,
  FaqSection,
} from '@/components/home';

export default async function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero with Orange Banner */}
      <HeroBanner />

      {/* Trusted Local Experts Section */}
      <LocalExperts />

      {/* Craft Workshops Feature Section */}
      <CraftWorkshops />

      {/* Meet the Masters Gallery */}
      <MastersGallery />

      {/* Traveler Reviews */}
      <ReviewsSection />

      {/* Plan Your Journey Destinations */}
      <JourneyDestinations />

      {/* Is This Right for You Features */}
      <FeaturesGrid />

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
