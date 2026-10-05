import type { ReactNode } from 'react';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  title: string;
  subtitle?: string;
  breadcrumb: ReactNode;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
};

/** Header band for inner pages: breadcrumb, label, single H1, optional photo */
export function PageHero({ label, title, subtitle, breadcrumb, image, imageAlt = '', children }: Props) {
  if (image) {
    return (
      <section className="relative isolate overflow-hidden">
        <SmartImage
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={70}
          className="-z-20 object-cover"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/[0.65] via-black/45 to-black/35"
          aria-hidden="true"
        />
        <div className="container max-w-content pb-20 pt-6 lg:pb-28">
          {breadcrumb}
          <div className="mt-16 max-w-3xl text-white lg:mt-24">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#F2C8C2]">{label}</p>
            <h1 className="mt-4 font-display text-hero font-extrabold">{title}</h1>
            {subtitle && <p className="mt-6 text-lg leading-relaxed text-white/90">{subtitle}</p>}
            {children}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-surface">
      <div className="container max-w-content pb-16 pt-6 lg:pb-24">
        {breadcrumb}
        <div className={cn('mt-10 max-w-3xl lg:mt-16')}>
          <p className="section-label">{label}</p>
          <h1 className="mt-4 font-display text-hero font-extrabold text-ink">{title}</h1>
          {subtitle && <p className="mt-6 text-lg leading-relaxed text-muted">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
