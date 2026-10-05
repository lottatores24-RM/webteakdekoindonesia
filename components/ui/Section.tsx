import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  tone?: 'canvas' | 'surface' | 'dark';
  className?: string;
  id?: string;
  labelledBy?: string;
};

/** Full-width band with the standard 96–120px vertical rhythm and 1280px content width */
export function Section({ children, tone = 'canvas', className, id, labelledBy }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'py-24 lg:py-[120px]',
        tone === 'canvas' && 'bg-canvas',
        tone === 'surface' && 'bg-surface',
        tone === 'dark' && 'bg-forest text-oncream',
        className,
      )}
    >
      <div className="container max-w-content">{children}</div>
    </section>
  );
}
