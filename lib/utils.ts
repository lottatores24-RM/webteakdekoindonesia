import { clsx, type ClassValue } from 'clsx';
import { site } from './site';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** wa.me link with a pre-filled message. Number without "+" and spaces. */
export function whatsappUrl(message: string, number: string = site.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = '') {
  return `${site.url}${path}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
