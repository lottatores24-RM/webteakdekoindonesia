import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Locale } from './i18n';
import { getImage, type ImageMeta } from './images';

export const categories = ['tables-and-stools', 'decoration'] as const;
export type Category = (typeof categories)[number];

/** Cover photo for each collection */
export const categoryImages: Record<Category, { src: string; contain?: boolean }> = {
  'tables-and-stools': { src: '/images/products/tables/root-block-table.jpg' },
  decoration: { src: '/images/products/decoration/root-ring-sculpture.jpg', contain: true },
};

export const productTypes = [
  'coffee-table',
  'side-table',
  'console',
  'bench',
  'stool',
  'mirror',
  'lantern',
  'candle-holder',
  'bowl',
  'vase',
  'tray',
  'sculpture',
  'pedestal',
] as const;
export type ProductType = (typeof productTypes)[number];

export const materials = ['teak-root', 'recycled-teak', 'teak-branch', 'trembesi'] as const;
export type Material = (typeof materials)[number];

type Localized = Record<Locale, string>;

export type ProductFrontmatter = {
  slug: string;
  category: Category;
  type: ProductType;
  materials: Material[];
  images: string[];
  /** Photo already has a plain white background — show it contained, not cropped */
  cutout?: boolean;
  bestSeller?: boolean;
  order: number;
  code: string;
  dimensions: string;
  name: Localized;
  summary: Localized;
};

export type Product = ProductFrontmatter & { body: string };

/** Serializable product data for cards and client-side filtering */
export type ProductCardData = {
  slug: string;
  category: Category;
  type: ProductType;
  materials: Material[];
  name: string;
  summary: string;
  dimensions: string;
  code: string;
  cutout: boolean;
  bestSeller: boolean;
  image: ImageMeta;
};

const dir = path.join(process.cwd(), 'content', 'products');

let cache: Product[] | null = null;

export function getAllProducts(): Product[] {
  if (cache) return cache;
  cache = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      const fm = data as ProductFrontmatter;
      if (fm.slug !== file.replace(/\.mdx$/, '')) {
        throw new Error(`Product slug "${fm.slug}" must match file name "${file}"`);
      }
      return { ...fm, body: content };
    })
    .sort((a, b) => a.order - b.order);
  return cache;
}

export function getProduct(slug: string) {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Category) {
  return getAllProducts().filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4) {
  const same = getAllProducts().filter((p) => p.slug !== product.slug && p.category === product.category);
  const sameType = same.filter((p) => p.type === product.type);
  return [...sameType, ...same.filter((p) => p.type !== product.type)].slice(0, limit);
}

export function toCardData(p: Product, locale: Locale): ProductCardData {
  return {
    slug: p.slug,
    category: p.category,
    type: p.type,
    materials: p.materials,
    name: p.name[locale],
    summary: p.summary[locale],
    dimensions: p.dimensions,
    code: p.code,
    cutout: Boolean(p.cutout),
    bestSeller: Boolean(p.bestSeller),
    image: getImage(p.images[0]),
  };
}

export function isCategory(value: string): value is Category {
  return (categories as readonly string[]).includes(value);
}
