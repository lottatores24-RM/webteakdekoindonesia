import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';

type Props = {
  href: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  cta: string;
  count?: string;
  index?: number;
  contain?: boolean;
};

/** Large image card linking to a collection */
export function CategoryCard({ href, title, text, image, imageAlt, cta, count, index = 0, contain }: Props) {
  return (
    <article
      className="group relative overflow-hidden rounded-lg bg-canvas ring-1 ring-line transition hover:shadow-soft"
      data-reveal
      style={{ ['--reveal-delay' as string]: `${index * 100}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <SmartImage
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 600px, 92vw"
          className={cn(
            'transition-transform duration-500 ease-out group-hover:scale-[1.03]',
            contain ? 'object-contain p-6' : 'object-cover',
          )}
        />
      </div>
      <div className="p-7 lg:p-9">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-3xl font-bold text-ink">
            <Link href={href} className="after:absolute after:inset-0 after:content-['']">
              {title}
            </Link>
          </h3>
          {count && <span className="shrink-0 text-sm text-muted">{count}</span>}
        </div>
        <p className="mt-3 leading-relaxed text-muted">{text}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-semibold text-accent-text transition-[gap] group-hover:gap-3">
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
