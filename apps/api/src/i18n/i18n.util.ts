import { Request } from 'express';
import { Locale } from '@prisma/client';

/**
 * Supported locales for the platform
 */
export const SUPPORTED_LOCALES: Locale[] = ['en', 'ru', 'uz'];

/**
 * Default fallback locale
 */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Parse locale from request
 * Priority: 1) Query param ?lang= 2) Accept-Language header 3) Default 'en'
 *
 * @param req - Express request object
 * @returns Normalized locale ('en' | 'ru' | 'uz')
 */
export function parseLocale(req: Request): Locale {
  // Priority 1: Query parameter ?lang=
  const queryLang = req.query.lang as string | undefined;
  if (queryLang && isValidLocale(queryLang)) {
    return queryLang as Locale;
  }

  // Priority 2: Accept-Language header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    const locale = parseAcceptLanguage(acceptLanguage);
    if (locale) {
      return locale;
    }
  }

  // Priority 3: Default fallback
  return DEFAULT_LOCALE;
}

/**
 * Check if locale string is valid
 */
export function isValidLocale(locale: string): boolean {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

/**
 * Parse Accept-Language header
 * Extracts the primary language code from Accept-Language header
 *
 * Example: "ru-RU,ru;q=0.9,en;q=0.8" -> "ru"
 */
function parseAcceptLanguage(header: string): Locale | null {
  // Split by comma to get language preferences
  const languages = header.split(',');

  for (const lang of languages) {
    // Extract language code (before '-' or ';')
    const code = lang.trim().split(/[-;]/)[0].toLowerCase();

    if (isValidLocale(code)) {
      return code as Locale;
    }
  }

  return null;
}

/**
 * Get translation with fallback logic
 * Returns requested locale translation if available, otherwise falls back to English
 *
 * @param translations - Array of translations from Prisma
 * @param requestedLocale - Requested locale
 * @returns Translation object or null if none found
 */
export function getTranslationWithFallback<T extends { locale: Locale }>(
  translations: T[],
  requestedLocale: Locale,
): T | null {
  if (!translations || translations.length === 0) {
    return null;
  }

  // Try requested locale first
  const requestedTranslation = translations.find(
    (t) => t.locale === requestedLocale,
  );
  if (requestedTranslation) {
    return requestedTranslation;
  }

  // Fallback to English
  const englishTranslation = translations.find((t) => t.locale === 'en');
  if (englishTranslation) {
    return englishTranslation;
  }

  // Last resort: return first available translation
  return translations[0] || null;
}

/**
 * Helper to log missing translations for monitoring
 */
export function logMissingTranslation(
  entityType: string,
  entityId: string,
  requestedLocale: Locale,
  availableLocales: Locale[],
): void {
  console.warn(
    `[i18n] Missing translation: ${entityType}#${entityId} - ` +
      `Requested: ${requestedLocale}, Available: [${availableLocales.join(', ')}]`,
  );
}
