import { Locale } from '@prisma/client';

/**
 * Helper functions for working with translation tables
 */

export interface WithTranslations<T> {
  translations: T[];
}

/**
 * Get translation for a specific locale from translations array
 * Falls back to English if requested locale not found
 */
export function getTranslation<T extends { locale: Locale }>(
  translations: T[],
  locale: Locale = Locale.en,
): T | undefined {
  // Try requested locale first
  const translation = translations.find(t => t.locale === locale);
  if (translation) return translation;

  // Fallback to English
  const enTranslation = translations.find(t => t.locale === Locale.en);
  if (enTranslation) return enTranslation;

  // Return first available translation
  return translations[0];
}

/**
 * Transform entity with translations to include translated fields at root level
 */
export function transformWithTranslation<
  TEntity extends WithTranslations<TTranslation>,
  TTranslation extends { locale: Locale },
  TResult = Omit<TEntity, 'translations'> & Partial<Omit<TTranslation, 'locale' | 'id' | 'createdAt' | 'updatedAt'>>,
>(
  entity: TEntity,
  locale: Locale = Locale.en,
): TResult {
  const translation = getTranslation(entity.translations, locale);
  const { translations, ...baseFields } = entity;

  if (!translation) {
    return baseFields as TResult;
  }

  // Extract only content fields from translation (exclude metadata)
  const { locale: _locale, id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...translatedFields } = translation as any;

  return {
    ...baseFields,
    ...translatedFields,
  } as TResult;
}

/**
 * Transform array of entities with translations
 */
export function transformManyWithTranslations<
  TEntity extends WithTranslations<TTranslation>,
  TTranslation extends { locale: Locale },
>(
  entities: TEntity[],
  locale: Locale = Locale.en,
): any[] {
  return entities.map(entity => transformWithTranslation(entity, locale));
}

/**
 * Prisma include clause for translations with locale filter
 */
export function includeTranslations(locale: Locale = Locale.en) {
  return {
    translations: {
      where: { locale },
    },
  };
}

/**
 * Prisma include clause for all translations (admin panel use case)
 */
export function includeAllTranslations() {
  return {
    translations: true,
  };
}
