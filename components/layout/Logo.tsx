import Image from 'next/image';
import logo from '@/public/images/logo/logo-full.png';
import logoLight from '@/public/images/logo/logo-light.png';
import { cn } from '@/lib/utils';

/** Logo with a light variant for dark backgrounds / dark mode */
export function Logo({
  alt,
  variant = 'auto',
  className,
  priority,
}: {
  alt: string;
  variant?: 'auto' | 'light';
  className?: string;
  priority?: boolean;
}) {
  if (variant === 'light') {
    return <Image src={logoLight} alt={alt} className={cn('w-auto', className)} priority={priority} sizes="200px" />;
  }
  return (
    <>
      <Image src={logo} alt={alt} className={cn('w-auto dark:hidden', className)} priority={priority} sizes="200px" />
      <Image src={logoLight} alt={alt} className={cn('hidden w-auto dark:block', className)} sizes="200px" />
    </>
  );
}
