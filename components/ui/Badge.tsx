import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: 'default' | 'gold';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]',
        tone === 'default' && 'bg-surface text-muted ring-1 ring-line',
        tone === 'gold' && 'bg-gold text-[#1A1917]',
        className,
      )}
    >
      {children}
    </span>
  );
}
