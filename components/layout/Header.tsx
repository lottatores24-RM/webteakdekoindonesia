'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n';
import { mainNav } from '@/lib/site';
import { cn } from '@/lib/utils';
import { buttonClass } from '@/components/ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export function Header() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const opener = openRef.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b bg-canvas/95 backdrop-blur transition-colors supports-[backdrop-filter]:bg-canvas/85',
          scrolled ? 'border-line' : 'border-transparent',
        )}
      >
        <div className="container flex h-16 max-w-content items-center justify-between gap-4 lg:h-[72px]">
          <Link href="/" className="flex shrink-0 items-center" aria-label={`${tc('logoAlt')} — ${t('home')}`}>
            <Logo alt={tc('logoAlt')} className="h-10 lg:h-12" priority />
          </Link>

          <nav aria-label={t('mainLabel')} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex min-h-[44px] items-center px-3 text-[15px] font-semibold transition-colors hover:text-accent-text',
                      isActive(item.href) ? 'text-accent-text' : 'text-ink',
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher className="hidden sm:flex" />
            <ThemeToggle />
            <Link href="/request-catalog" className={buttonClass('primary', 'md', 'hidden md:inline-flex')}>
              {t('requestCatalog')}
            </Link>
            <button
              ref={openRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface xl:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">{t('openMenu')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — outside <header>: its backdrop-filter would trap position:fixed children */}
      <div className={cn('fixed inset-0 z-50 xl:hidden', open ? 'visible' : 'invisible')} aria-hidden={!open}>
        <div
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setOpen(false)}
        />
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t('mainLabel')}
          className={cn(
            'absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-canvas shadow-2xl transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-6">
            <LanguageSwitcher onNavigate={() => setOpen(false)} />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-surface"
            >
              <X className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">{t('closeMenu')}</span>
            </button>
          </div>
          <nav aria-label={t('mainLabel')} className="flex-1 overflow-y-auto px-6 py-6">
            <ul className="space-y-1">
              <li>
                <Link href="/" className="flex min-h-[48px] items-center font-display text-2xl font-bold text-ink">
                  {t('home')}
                </Link>
              </li>
              {mainNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'flex min-h-[48px] items-center font-display text-2xl font-bold',
                      isActive(item.href) ? 'text-accent-text' : 'text-ink',
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-line p-6">
            <Link href="/request-catalog" className={buttonClass('primary', 'lg', 'w-full')}>
              {t('requestCatalog')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
