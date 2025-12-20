import Header from './components/Header';
import Hero from './components/Hero';
import TrustedExperts from './components/TrustedExperts';
import ArtisanCrafts from './components/ArtisanCrafts';
import MeetMasters from './components/MeetMasters';
import Reviews from './components/Reviews';
import BlogSection from './components/BlogSection';
import ExperienceMatch from './components/ExperienceMatch';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedExperts />
        <ArtisanCrafts />
        <MeetMasters />
        <Reviews />
        <BlogSection />
        <ExperienceMatch />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
