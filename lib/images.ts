import imageMeta from './image-meta.json';

export type ImageMeta = { src: string; width: number; height: number; blur?: string };

const meta = imageMeta as Record<string, { width: number; height: number; blur: string }>;

/** Width/height/blur placeholder for an image in /public, generated at build time. */
export function getImage(src: string): ImageMeta {
  const m = meta[src];
  if (!m) return { src, width: 1200, height: 800 };
  return { src, width: m.width, height: m.height, blur: m.blur };
}
