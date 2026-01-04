"use client"

import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('navigation')

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Jahongir Travel</h3>
            <p className="text-gray-300 mb-4">
              {t('companyDescription')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-white transition-colors">
                  {t('allTours')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {tNav('contact')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  {tNav('blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('popularDestinations')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tours?destination=samarkand" className="text-gray-300 hover:text-white transition-colors">
                  Samarkand
                </Link>
              </li>
              <li>
                <Link href="/tours?destination=bukhara" className="text-gray-300 hover:text-white transition-colors">
                  Bukhara
                </Link>
              </li>
              <li>
                <Link href="/tours?destination=khiva" className="text-gray-300 hover:text-white transition-colors">
                  Khiva
                </Link>
              </li>
              <li>
                <Link href="/tours?destination=tashkent" className="text-gray-300 hover:text-white transition-colors">
                  Tashkent
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Tashkent, Uzbekistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+998901234567" className="text-gray-300 hover:text-white transition-colors">
                  +998 90 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:info@jahongir-travel.uz" className="text-gray-300 hover:text-white transition-colors">
                  info@jahongir-travel.uz
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Jahongir Travel. {t('copyright')}
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                {t('termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
