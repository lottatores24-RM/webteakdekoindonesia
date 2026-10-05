import 'server-only';
import type { Locale } from './i18n';
import { getAllProducts } from './products';
import { getImage, type ImageMeta } from './images';

export const galleryFilters = ['all', 'products', 'workshop', 'display'] as const;
export type GalleryCategory = Exclude<(typeof galleryFilters)[number], 'all'>;

export type GalleryItem = ImageMeta & { category: GalleryCategory; alt: string; caption: string };

/** Non-product photos. Alt text and captions live in messages under gallery.photos.<key> */
export const placePhotos = [
  { key: 'sign', src: '/images/gallery/sign.jpg', category: 'workshop' },
  { key: 'yard', src: '/images/hero/workshop-yard.jpg', category: 'workshop' },
  { key: 'stock', src: '/images/hero/workshop-stock.jpg', category: 'workshop' },
  { key: 'blocks', src: '/images/gallery/teak-block-stock.jpg', category: 'workshop' },
  { key: 'garden', src: '/images/hero/garden-display.jpg', category: 'display' },
  { key: 'exhibition', src: '/images/gallery/exhibition.jpg', category: 'display' },
] as const;

export type PlacePhotoKey = (typeof placePhotos)[number]['key'];

export function getGalleryItems(
  locale: Locale,
  t: (key: PlacePhotoKey, field: 'alt' | 'caption') => string,
  productAlt: (name: string) => string,
): GalleryItem[] {
  const places: GalleryItem[] = placePhotos.map((p) => ({
    ...getImage(p.src),
    category: p.category,
    alt: t(p.key, 'alt'),
    caption: t(p.key, 'caption'),
  }));
  const products: GalleryItem[] = getAllProducts().flatMap((p) =>
    p.images.map((src) => ({
      ...getImage(src),
      category: 'products' as const,
      alt: productAlt(p.name[locale]),
      caption: p.name[locale],
    })),
  );
  // Interleave so the "All" view mixes workshop moments with products
  const out: GalleryItem[] = [];
  const step = Math.ceil(products.length / places.length);
  places.forEach((place, i) => {
    out.push(place, ...products.slice(i * step, (i + 1) * step));
  });
  return out;
}
