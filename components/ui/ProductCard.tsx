import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n';
import type { ProductCardData } from '@/lib/products';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';

type Props = { product: ProductCardData; index?: number; priority?: boolean };

export function ProductCard({ product, index = 0, priority }: Props) {
  const t = useTranslations();
  const href = `/products/${product.slug}` as const;
  const { image } = product;

  return (
    <article
      className="group relative flex flex-col rounded-lg p-3 ring-1 ring-transparent transition duration-300 hover:shadow-soft hover:ring-line"
      data-reveal
      style={{ ['--reveal-delay' as string]: `${(index % 4) * 100}ms` }}
    >
      <div className="relative aspect-square overflow-hidden rounded bg-white">
        <Image
          src={image.src}
          alt={t('common.productAlt', { name: product.name })}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 92vw"
          priority={priority}
          {...(image.blur ? { placeholder: 'blur' as const, blurDataURL: image.blur } : {})}
          className={cn(
            'transition-transform duration-300 ease-out group-hover:scale-[1.03]',
            product.cutout ? 'object-contain p-4' : 'object-cover',
          )}
        />
        {product.bestSeller && (
          <Badge tone="gold" className="absolute left-3 top-3">
            {t('common.bestSeller')}
          </Badge>
        )}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/35 via-black/0 to-transparent p-4 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
          <span className="rounded bg-white/95 px-4 py-2 text-sm font-semibold text-[#1A1917] shadow-soft">
            {t('common.viewDetails')}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
          {t(`categories.${product.category}.name`)}
        </p>
        <h3 className="mt-1.5 text-base font-bold leading-snug text-ink">
          {/* Stretched link: the whole card opens the product */}
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">
          {product.materials.map((m) => t(`filters.materials.${m}`)).join(' · ')} — {product.dimensions}
        </p>
        <Link
          href={`${href}#inquiry`}
          className="relative z-10 mt-3 inline-flex min-h-[44px] items-center gap-1.5 self-start text-sm font-semibold text-accent-text transition-[gap] hover:gap-2.5"
        >
          {t('common.askQuote')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
