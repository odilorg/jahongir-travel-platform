import { Button } from "@/components/ui/button"
import { Users, DollarSign, Calendar, Palette, Check } from "lucide-react"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"

const impactFeatures = [
  {
    icon: Users,
    title: "Maximum 8 Travelers",
    description: "Small groups for authentic experiences",
  },
  {
    icon: DollarSign,
    title: "Fair Pay to Artisans",
    description: "Direct support for craftspeople",
  },
  {
    icon: Calendar,
    title: "Multi-Day Immersion",
    description: "Deep dive into traditional crafts",
  },
  {
    icon: Palette,
    title: "Craft-First Itineraries",
    description: "Workshops at the heart of every tour",
  },
]

const stats = [
  { value: "45", label: "Master artisans we work with" },
  { value: "12", label: "Traditional craft forms preserved" },
  { value: "$83k+", label: "Paid directly to artisans" },
  { value: "100%", label: "Family-owned workshops" },
]

const organizations = [
  "UNESCO Samarkand",
  "Uzbekistan Craft Guild",
  "Margilan Silk Factory",
  "Rishton Paper Workshop",
]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Content continues as before - keeping existing structure for now */}
      {/* This can be fully translated later */}

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are a craft-focused travel company connecting travelers to master artisans
              who've dedicated their lives to traditional Uzbek crafts.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Meet the Masters?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join us on a journey that preserves heritage, supports artisans, and creates
            unforgettable memories.
          </p>
          <Link href="/tours">
            <Button
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-10 py-6 text-lg"
            >
              Explore Craft Workshops
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
