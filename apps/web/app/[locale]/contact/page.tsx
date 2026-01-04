import { getTranslations } from "next-intl/server"
import { ContactForm } from "./contact-form"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg opacity-90">{t('subtitle')}</p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <ContactForm />
      </div>
    </div>
  )
}
