'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Material, ProductCardData, ProductType } from '@/lib/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { FilterTabs } from '@/components/ui/FilterTabs';

/** Groups used on the all-products view (adapted from the All Seasons tab row) */
const groups: Record<string, (p: ProductCardData) => boolean> = {
  all: () => true,
  'tables-and-stools': (p) => p.category === 'tables-and-stools',
  mirrors: (p) => p.type === 'mirror',
  lighting: (p) => p.type === 'lantern' || p.type === 'candle-holder',
  'bowls-vases': (p) => p.type === 'bowl' || p.type === 'vase' || p.type === 'tray',
  sculpture: (p) => p.type === 'sculpture' || p.type === 'pedestal',
};

type Props = {
  products: ProductCardData[];
  /** "groups": All / Tables & Stools / Mirrors…; "types": filter by product type within one category */
  mode?: 'groups' | 'types' | 'none';
  showMaterials?: boolean;
};

export function ProductGrid({ products, mode = 'groups', showMaterials = false }: Props) {
  const t = useTranslations('filters');
  const tc = useTranslations('collections');
  const tCommon = useTranslations('common');
  const [primary, setPrimary] = useState('all');
  const [material, setMaterial] = useState<'all' | Material>('all');

  const primaryOptions = useMemo(() => {
    if (mode === 'groups') {
      return Object.keys(groups)
        .map((key) => ({
          value: key,
          label: t(`groups.${key}` as 'groups.all'),
          count: products.filter(groups[key]).length,
        }))
        .filter((o) => o.count > 0);
    }
    if (mode === 'types') {
      const types = Array.from(new Set(products.map((p) => p.type))) as ProductType[];
      return [
        { value: 'all', label: t('types.all'), count: products.length },
        ...types.map((type) => ({
          value: type,
          label: t(`types.${type}`),
          count: products.filter((p) => p.type === type).length,
        })),
      ];
    }
    return [];
  }, [mode, products, t]);

  const materialOptions = useMemo(() => {
    const ms = Array.from(new Set(products.flatMap((p) => p.materials))) as Material[];
    return [{ value: 'all', label: t('allMaterials') }, ...ms.map((m) => ({ value: m, label: t(`materials.${m}`) }))];
  }, [products, t]);

  const visible = products.filter((p) => {
    const okPrimary = primary === 'all' || (mode === 'groups' ? groups[primary]?.(p) : p.type === primary);
    const okMaterial = material === 'all' || p.materials.includes(material);
    return okPrimary && okMaterial;
  });

  return (
    <div>
      {(mode !== 'none' || showMaterials) && (
        <div className="mb-10 space-y-4">
          {mode !== 'none' && (
            <FilterTabs options={primaryOptions} value={primary} onChange={setPrimary} label={t('type')} />
          )}
          {showMaterials && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{t('material')}</span>
              <FilterTabs
                options={materialOptions}
                value={material}
                onChange={(v) => setMaterial(v as 'all' | Material)}
                label={t('material')}
                size="sm"
              />
            </div>
          )}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {tCommon('productsCount', { count: visible.length })}
      </p>

      {visible.length > 0 ? (
        <div
          key={`${primary}-${material}`}
          className="grid animate-fade-in grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {visible.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg bg-surface p-8 text-center text-muted">{tc('empty')}</p>
      )}
    </div>
  );
}
