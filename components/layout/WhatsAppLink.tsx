'use client';

import type { ReactNode } from 'react';
import { whatsappUrl } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { buttonClass } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

type Props = {
  message: string;
  children: ReactNode;
  location: string;
  variant?: 'whatsapp' | 'outline-light' | 'outline';
  size?: 'md' | 'lg';
  className?: string;
  number?: string;
};

/** WhatsApp chat button with pre-filled message and click tracking */
export function WhatsAppLink({
  message,
  children,
  location,
  variant = 'whatsapp',
  size = 'md',
  className,
  number,
}: Props) {
  return (
    <a
      href={whatsappUrl(message, number)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { location })}
      className={buttonClass(variant, size, className)}
    >
      <WhatsAppIcon />
      {children}
    </a>
  );
}
