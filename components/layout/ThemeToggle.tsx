'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

/** Light/dark switch. Initial theme is set before paint by the inline script in the layout. */
export function ThemeToggle() {
  const t = useTranslations('common');

  const toggle = () => {
    const root = document.documentElement;
    const dark = !root.classList.contains('dark');
    root.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
    >
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
      <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <span className="sr-only dark:hidden">{t('themeDark')}</span>
      <span className="sr-only hidden dark:inline">{t('themeLight')}</span>
    </button>
  );
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}document.documentElement.classList.add('js')})()`;
