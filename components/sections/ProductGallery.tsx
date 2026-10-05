'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ImageMeta } from '@/lib/images';
import { cn } from '@/lib/utils';

/** Large product photo with thumbnails when a product has several images */
export function ProductGallery({ images, alt, cutout }: { images: ImageMeta[]; alt: string; cutout?: boolean }) {
  const [active, setActive] = useState(0);
  const img = images[active];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white ring-1 ring-line">
        <Image
          key={img.src}
          src={img.src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 620px, 92vw"
          {...(img.blur ? { placeholder: 'blur' as const, blurDataURL: img.blur } : {})}
          className={cn('animate-fade-in', cutout ? 'object-contain p-8' : 'object-cover')}
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((im, i) => (
            <button
              key={im.src}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`${alt} (${i + 1}/${images.length})`}
              className={cn(
                'relative aspect-square overflow-hidden rounded ring-2 transition',
                i === active ? 'ring-accent' : 'ring-transparent hover:ring-line',
              )}
            >
              <Image src={im.src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
