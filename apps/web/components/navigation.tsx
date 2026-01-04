"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, Phone, Mail, Globe } from "lucide-react"
import { usePathname, useRouter, Link } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale()
  const t = useTranslations('navigation')
  const tCommon = useTranslations('common')

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  ]

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale })
    setLangMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar with contact info */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <a href="tel:+998901234567" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span>+998 90 123 45 67</span>
            </a>
            <a href="mailto:info@jahongir-travel.uz" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              <span>info@jahongir-travel.uz</span>
            </a>
          </div>
          <div className="text-xs text-gray-500">
            {t('tagline')}
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              Jahongir
              <span className="text-primary">Travel</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {t('home')}
            </Link>
            <Link
              href="/tours"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {t('tours')}
            </Link>
            <Link
              href="/destinations"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {t('destinations')}
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {t('blog')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {t('contact')}
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>

            {/* Language Switcher */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium uppercase">{currentLocale}</span>
              </Button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                          currentLocale === lang.code ? 'bg-gray-50 text-primary font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Button size="sm">{tCommon('bookNow')}</Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col p-4 space-y-3">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link
              href="/tours"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('tours')}
            </Link>
            <Link
              href="/destinations"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('destinations')}
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('blog')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('contact')}
            </Link>

            {/* Language Switcher - Mobile */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t('language')}
              </p>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                      currentLocale === lang.code ? 'bg-gray-50 text-primary font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button className="mt-4 w-full">{tCommon('bookNow')}</Button>
          </nav>
        </div>
      )}
    </header>
  )
}
