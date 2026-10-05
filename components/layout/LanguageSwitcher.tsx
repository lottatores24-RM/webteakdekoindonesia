'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, locales } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** EN | ID toggle that keeps the visitor on the same page */
export function LanguageSwitcher({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div role="group" aria-label={t('language')} className={cn('flex items-center text-sm font-semibold', className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span className="px-0.5 text-line" aria-hidden="true">
              |
            </span>
          )}
          {l === locale ? (
            <span
              aria-current="true"
              className="inline-flex min-h-[44px] min-w-[36px] items-center justify-center text-accent-text"
            >
              {l.toUpperCase()}
            </span>
          ) : (
            <Link
              // pathname is the current route without the locale prefix
              href={pathname}
              locale={l}
              lang={l}
              hrefLang={l}
              onClick={onNavigate}
              aria-label={t('switchTo', { language: t(`languages.${l}`) })}
              className="inline-flex min-h-[44px] min-w-[36px] items-center justify-center text-muted transition hover:text-ink"
            >
              {l.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
