'use client';

import { useTranslations } from 'next-intl';
import { whatsappUrl } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

export function WhatsAppButton() {
  const t = useTranslations('whatsapp');
  return (
    <a
      href={whatsappUrl(t('defaultMessage'))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { location: 'floating' })}
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 animate-wa-pulse items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1DA851] motion-reduce:animate-none"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="sr-only">{t('floatingLabel')}</span>
    </a>
  );
}
