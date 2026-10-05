'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { cn } from '@/lib/utils';

export type GalleryImage = {
  src: string;
  width: number;
  height: number;
  blur?: string;
  alt: string;
  caption: string;
  category: string;
};

type Props = {
  images: GalleryImage[];
  /** Filter values in display order, e.g. ['all','products','workshop','display'] */
  filters?: readonly string[];
};

/** Masonry gallery with category filter and an accessible lightbox (keyboard, swipe, zoom) */
export function ImageGallery({ images, filters }: Props) {
  const t = useTranslations('gallery');
  const [filter, setFilter] = useState('all');
  const [index, setIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const visible = filter === 'all' ? images : images.filter((i) => i.category === filter);

  const close = useCallback(() => {
    setIndex(null);
    setZoom(false);
    lastTrigger.current?.focus();
  }, []);
  const go = useCallback(
    (dir: 1 | -1) => {
      setZoom(false);
      setIndex((i) => (i === null ? i : (i + dir + visible.length) % visible.length));
    },
    [visible.length],
  );

  useEffect(() => {
    if (index === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, close, go]);

  const current = index !== null ? visible[index] : null;

  return (
    <div>
      {filters && (
        <div className="mb-10">
          <FilterTabs
            label={t('hero.label')}
            value={filter}
            onChange={setFilter}
            options={filters.map((f) => ({
              value: f,
              label: t(`filters.${f}` as 'filters.all'),
              count: f === 'all' ? images.length : images.filter((i) => i.category === f).length,
            }))}
          />
        </div>
      )}

      <ul key={filter} className="animate-fade-in columns-1 gap-5 sm:columns-2 lg:columns-3">
        {visible.map((img, i) => (
          <li
            key={img.src}
            className="mb-5 break-inside-avoid"
            data-reveal
            style={{ ['--reveal-delay' as string]: `${(i % 3) * 100}ms` }}
          >
            <figure>
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setIndex(i);
                }}
                className="group relative block w-full overflow-hidden rounded-lg bg-surface"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw"
                  {...(img.blur ? { placeholder: 'blur' as const, blurDataURL: img.blur } : {})}
                  className="h-auto w-full transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100 group-focus-visible:bg-black/25 group-focus-visible:opacity-100">
                  <ZoomIn className="h-8 w-8 text-white" aria-hidden="true" />
                </span>
                <span className="sr-only">{t('lightbox.open', { caption: img.caption })}</span>
              </button>
              <figcaption className="mt-2 text-sm text-muted">{img.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {current && index !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('lightbox.label')}
          tabIndex={-1}
          className="fixed inset-0 z-[70] flex animate-fade-in flex-col bg-black/95 text-white outline-none"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null || zoom) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between gap-4 p-3 sm:p-4">
            <p className="pl-2 text-sm text-white/80" aria-live="polite">
              {t('lightbox.counter', { current: index + 1, total: visible.length })} — {current.caption}
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setZoom((z) => !z)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
              >
                {zoom ? (
                  <ZoomOut className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ZoomIn className="h-5 w-5" aria-hidden="true" />
                )}
                <span className="sr-only">{zoom ? t('lightbox.zoomOut') : t('lightbox.zoomIn')}</span>
              </button>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
              >
                <X className="h-6 w-6" aria-hidden="true" />
                <span className="sr-only">{t('lightbox.close')}</span>
              </button>
            </div>
          </div>

          <div
            className={cn('relative flex-1', zoom ? 'overflow-auto' : 'overflow-hidden')}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div
              className={cn(
                'relative mx-auto transition-all duration-300',
                zoom ? 'h-[180%] w-[180%] cursor-zoom-out' : 'h-full w-full cursor-zoom-in',
              )}
              onClick={() => setZoom((z) => !z)}
            >
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                quality={85}
                {...(current.blur ? { placeholder: 'blur' as const, blurDataURL: current.blur } : {})}
                className="object-contain p-2 sm:p-8"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 hover:bg-white/15 sm:left-4"
          >
            <ChevronLeft className="h-7 w-7" aria-hidden="true" />
            <span className="sr-only">{t('lightbox.previous')}</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 hover:bg-white/15 sm:right-4"
          >
            <ChevronRight className="h-7 w-7" aria-hidden="true" />
            <span className="sr-only">{t('lightbox.next')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
