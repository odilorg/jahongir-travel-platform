import { Button } from "@/components/ui/button"
import { Users, DollarSign, Calendar, Palette, Check } from "lucide-react"
import Link from "next/link"

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

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Preserving Heritage, One Craft at a Time
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              We are a small travel operator. We're a craft preservation initiative disguised
              as a travel company—connecting travelers to masters who've dedicated their lives to
              traditional crafts since generations before us lived.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              The Problem
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
              Traditional Crafts Are Disappearing
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Across Central Asia, centuries-old craft traditions are vanishing as artisans
              struggle to earn a living through their ancestral skills.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                <strong>The master woodcarvers in Khiva.</strong> The fourth-generation potters in Rishton. The
                silk-dye masters in Margilan. They're all facing the same crisis: They can't pay monthly
                expenses because their skills are not demanded yet.
              </p>
              <p className="text-gray-700 leading-relaxed">
                But thanks to the interest in experiential travel, families around the globe are choosing in-depth
                crafts, culture, and learning skills over tourist attractions, putting artisans back in the path
                of tourism.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-r-xl">
              <p className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">85%</p>
              <p className="text-xl text-gray-700">
                of traditional craft skills could disappear within one generation.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gray-50 rounded-xl">
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
              We believe there's a better way—one that respects artisans, preserves heritage, and
              creates meaningful connections.
            </p>
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Our Solution
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
              Small Groups, Deep Impact, Fair Pay
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We design craft-focused journeys that support artisans financially, preserve
              traditional skills, and give travelers authentic, meaningful experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow"
              >
                <div className="h-14 w-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-200 font-semibold text-sm uppercase tracking-wider">
              Our Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Making a Real Difference
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Since launching, we've built meaningful partnerships with artisan communities
              across Uzbekistan and helped preserve endangered skills.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Organizations */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Our Partners
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
              Working with Heritage Organizations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We collaborate with cultural institutions, craft guilds, and heritage organizations
              to ensure authentic, ethical craft tourism.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {organizations.map((org, index) => (
              <div
                key={index}
                className="bg-green-50 border border-green-200 p-6 rounded-xl text-center"
              >
                <p className="font-semibold text-green-800">{org}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-green-50 border border-green-200 px-6 py-3 rounded-full">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Ethical Tourism Certified
                </span>
              </div>
            </div>
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
