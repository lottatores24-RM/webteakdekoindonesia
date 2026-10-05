import Image, { type ImageProps } from 'next/image';
import { getImage } from '@/lib/images';

type Props = Omit<ImageProps, 'src' | 'width' | 'height' | 'placeholder' | 'blurDataURL'> & {
  src: string;
  fill?: boolean;
};

/**
 * next/image with build-time dimensions and blur placeholder for images in /public.
 * Server component — client components receive ImageMeta via props instead.
 */
export function SmartImage({ src, fill, alt, ...rest }: Props) {
  const meta = getImage(src);
  const blur = meta.blur ? { placeholder: 'blur' as const, blurDataURL: meta.blur } : {};
  if (fill) return <Image src={src} alt={alt} fill {...blur} {...rest} />;
  return <Image src={src} alt={alt} width={meta.width} height={meta.height} {...blur} {...rest} />;
}
