# Next.js i18n Migration Guide

## Status: Partially Complete

### Completed ✅
1. Installed `next-intl` package
2. Created i18n configuration files:
   - `src/i18n/routing.ts` - Routing configuration (en, ru, uz)
   - `src/i18n/request.ts` - Server-side request configuration
   - `src/middleware.ts` - Middleware for locale handling
3. Updated `next.config.ts` with next-intl plugin
4. Created translation files:
   - `messages/en.json` - English translations
   - `messages/ru.json` - Russian translations
   - `messages/uz.json` - Uzbek translations
5. Created `app/[locale]/layout.tsx` - Locale-specific layout
6. Created `app/[locale]/page.tsx` - Home page under locale

### TODO: Manual Steps Required ⚠️

#### Step 1: Copy Existing Routes to [locale]

You need to manually copy these directories:

```bash
cd /var/www/jahongir-dev/apps/web/app

# Copy tours directory
cp -r tours '[locale]'/

# Copy blog directory
cp -r blog '[locale]'/

# Copy about directory
cp -r about '[locale]'/

# Copy contact directory
cp -r contact '[locale]'/
```

#### Step 2: Delete Old Routes (After Copying)

```bash
# Once confirmed [locale] routes work, delete old routes:
rm -rf /var/www/jahongir-dev/apps/web/app/tours
rm -rf /var/www/jahongir-dev/apps/web/app/blog
rm -rf /var/www/jahongir-dev/apps/web/app/about
rm -rf /var/www/jahongir-dev/apps/web/app/contact

# Keep the root page.tsx (it will be replaced with redirect)
```

#### Step 3: Update Root Layout

Edit `app/layout.tsx` to remove Navigation and Footer (they're now in [locale]/layout.tsx):

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jahongir Travel - Unforgettable Cultural Immersion in Uzbekistan",
  description: "Experience the authentic Silk Road treasures with Jahongir Travel. Discover Samarkand, Bukhara, Khiva and more with our expert-guided cultural tours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
```

#### Step 4: Replace Root Page with Redirect

Edit `app/page.tsx`:

```tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en');
}
```

#### Step 5: Update Navigation Component

Edit `components/navigation.tsx` to use next-intl Link:

```tsx
// Change import from:
import Link from 'next/link'

// To:
import { Link } from '@/i18n/routing'

// All <Link href="/tours"> will now automatically include locale prefix
```

#### Step 6: Add Language Switcher

Create `components/language-switcher.tsx`:

```tsx
'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const locales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          {locales.find(l => l.code === locale)?.flag} {locales.find(l => l.code === locale)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc.code} value={loc.code}>
            {loc.flag} {loc.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

Add this to Navigation component.

#### Step 7: Update API Calls to Include Locale

In all fetch calls, add `lang` parameter:

```tsx
// Before:
const res = await fetch('http://localhost:4000/api/tours')

// After (in client components):
import { useLocale } from 'next-intl';

function Component() {
  const locale = useLocale();

  const res = await fetch(`http://localhost:4000/api/tours?lang=${locale}`)
}

// In server components/actions:
import { getLocale } from 'next-intl/server';

async function getData() {
  const locale = await getLocale();
  const res = await fetch(`http://localhost:4000/api/tours?lang=${locale}`)
}
```

#### Step 8: Use Translations in Components

```tsx
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('navigation');

  return <h1>{t('home')}</h1>  // Will show "Home", "Главная", or "Bosh sahifa"
}
```

#### Step 9: Build and Test

```bash
cd /var/www/jahongir-dev
pnpm build

# If build succeeds:
pm2 restart jahongir-dev-web

# Test URLs:
# http://localhost:3010/en
# http://localhost:3010/ru
# http://localhost:3010/uz
```

#### Step 10: Admin Routes (No i18n needed)

The `/admin/*` routes don't need i18n. They will continue to work at the root level without locale prefix.

## Architecture

### URL Structure
- `/` → Redirects to `/en` (or detected locale)
- `/en/*` → English content
- `/ru/*` → Russian content
- `/uz/*` → Uzbek content
- `/admin/*` → Admin panel (no locale prefix)

### Locale Detection Priority
1. Query parameter: `?lang=ru`
2. Accept-Language header
3. Default: `en`

### Translation Files
All UI strings are in `messages/{locale}.json`. API content (tours, blog posts) comes from database via API with `?lang=` parameter.

## Current Limitations

Due to VPS file operation constraints, the route migration must be done manually. All configuration and infrastructure is complete.

## Next Steps

1. Complete manual steps above
2. Test all routes work with locale prefixes
3. Update all components to use next-intl translations
4. Add language switcher to header
5. Update all API calls to include locale parameter
6. Test language switching preserves current path
7. Commit changes

## References

- Next-intl docs: https://next-intl-docs.vercel.app/
- Translation files: `apps/web/messages/`
- i18n config: `apps/web/src/i18n/`
