import { ChevronDown } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { LinkButton } from '@/components/ui/Button';

type Props = {
  label: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  scrollLabel: string;
};

/** Full-viewport homepage hero with the workshop photo behind a dark gradient */
export function Hero({ label, title, subtitle, image, imageAlt, primary, secondary, scrollLabel }: Props) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-64px)] items-end overflow-hidden lg:min-h-[calc(100svh-72px)]">
      <SmartImage src={image} alt={imageAlt} fill priority sizes="100vw" quality={60} className="-z-20 object-cover" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/[0.62] via-black/45 to-black/30"
        aria-hidden="true"
      />

      <div className="container max-w-content pb-24 pt-32 lg:pb-32">
        <div className="max-w-3xl text-white">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#F2C8C2]">{label}</p>
          <h1 className="mt-5 font-display text-hero font-extrabold">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">{subtitle}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <LinkButton href={primary.href} size="lg">
              {primary.label}
            </LinkButton>
            <LinkButton href={secondary.href} variant="outline-light" size="lg">
              {secondary.label}
            </LinkButton>
          </div>
        </div>
      </div>

      <a
        href="#trust"
        className="absolute bottom-6 left-1/2 inline-flex h-11 w-11 -translate-x-1/2 animate-bob items-center justify-center rounded-full text-white/85 hover:text-white motion-reduce:animate-none"
      >
        <ChevronDown className="h-7 w-7" aria-hidden="true" />
        <span className="sr-only">{scrollLabel}</span>
      </a>
    </section>
  );
}
