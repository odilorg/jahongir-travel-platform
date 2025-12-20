"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Star, ChevronDown } from "lucide-react"
import { submitContact, type ContactFormData } from "@/lib/api"
import Link from "next/link"

const faqs = [
  { q: "How can I book a tour?", a: "You can book directly through our website or contact us via email/WhatsApp for custom arrangements." },
  { q: "What should I pack for the tour?", a: "Comfortable clothes, walking shoes, and a camera. We'll send a detailed packing list after booking." },
  { q: "Are there any age restrictions for the tours?", a: "Most tours welcome all ages. Some craft workshops are best suited for ages 10+." },
  { q: "Can I customize my booking?", a: "Absolutely! Contact us to create a personalized itinerary based on your interests." },
  { q: "How can I contact customer support after the tour?", a: "We provide 24/7 WhatsApp support and email assistance throughout and after your journey." },
  { q: "Do you offer group discounts?", a: "Yes, we offer discounts for groups of 4 or more. Contact us for special rates." },
]

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    const result = await submitContact(formData)

    setIsSubmitting(false)

    if (result.success) {
      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } else {
      setSubmitStatus("error")
      setErrorMessage(result.error || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&h=600&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-700/90 to-orange-600/80" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact the Team
            </h1>
            <p className="text-xl text-amber-100">
              Planning your next trip to Uzbekistan? Let's talk!
              Our team of Silk Road experts is here to help you every step of the way.
            </p>
          </div>
          {/* Breadcrumb */}
          <div className="mt-6 text-amber-200 text-sm">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Contact</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
              <p className="text-gray-600 mb-8">
                Have a question or need help planning your perfect Uzbekistan adventure?
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+998 90 123 45 67"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select a subject</option>
                      <option value="Tour Inquiry">Tour Inquiry</option>
                      <option value="Custom Tour Request">Custom Tour Request</option>
                      <option value="Group Booking">Group Booking</option>
                      <option value="General Question">General Question</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Tell us about your travel plans..."
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      ✓ Message sent successfully! We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">✗ {errorMessage}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-8"
                  disabled={isSubmitting}
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                <p className="text-sm text-gray-500">
                  Your information is secure & private
                </p>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6">Get in touch</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    We love to chat about travel plans and are ready to help in any way.
                  </p>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Call Us</p>
                        <a href="tel:+998901234567" className="text-gray-600 hover:text-brand-orange">
                          +998 90 123 45 67
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <a href="https://wa.me/998901234567" className="text-gray-600 hover:text-brand-orange">
                          +998 90 123 45 67
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a href="mailto:info@jahongir-travel.uz" className="text-gray-600 hover:text-brand-orange">
                          info@jahongir-travel.uz
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Opening Hours</p>
                        <p className="text-gray-600 text-sm">
                          Monday through Friday<br />
                          9:00 - 18:00 (GMT+5)
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Tour Season (Apr - Sep)<br />
                          Mon - Sat: 8:00 - 20:00
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Head Office</p>
                        <p className="text-gray-600 text-sm">
                          Amir Temur Street 108<br />
                          Registan Square, 93 km to east in person!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-orange font-medium hover:underline"
                    >
                      <MapPin className="h-4 w-4" />
                      Open in Google Maps
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Need Immediate Help */}
              <Card className="bg-amber-50 border-amber-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Need immediate help?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Call or WhatsApp us for instant assistance
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="tel:+998901234567"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-blue-700"
                    >
                      Call Now
                    </a>
                    <a
                      href="https://wa.me/998901234567"
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-green-700"
                    >
                      WhatsApp
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border flex flex-col md:flex-row gap-6 items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Traveler"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 italic">
                "Exceptional service from start to finish! The team made our
                the perfect Silk Road journey. Their local knowledge and attention
                to detail was perfect!"
              </p>
              <p className="mt-2 font-semibold text-gray-900">Sarah Mitchell</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-amber-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Our team"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Faces behind every journey
              </h2>
              <p className="text-gray-700 mb-6">
                We're a small local team based in Samarkand – the same
                people who greet travelers, plan routes, and make every trip
                feel like family.
              </p>
              <p className="text-gray-700 mb-6">
                Whether it's crafting your first Silk Road itinerary or helping you choose
                the best guest house, you'll always talk to someone who knows
                Uzbekistan by heart.
              </p>
              <Link href="/about">
                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-6">
                  Meet the Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions about touring Uzbekistan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Didn't find your answer?</p>
            <a
              href="mailto:info@jahongir-travel.uz"
              className="text-brand-orange font-semibold hover:underline"
            >
              Contact us directly
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
