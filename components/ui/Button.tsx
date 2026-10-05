import type { ComponentProps } from 'react';
import { Link } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'outline-light' | 'ghost' | 'whatsapp';
type Size = 'md' | 'lg';

const base =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded font-semibold transition duration-200 ease-out hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white shadow-sm hover:bg-accent-hover hover:shadow-lift',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:shadow-soft',
  'outline-light': 'border border-white/70 text-white hover:bg-white hover:text-ink',
  ghost: 'text-accent-text underline-offset-4 hover:underline hover:scale-100',
  whatsapp:
    'border border-[#1DA851] text-[#137a3b] hover:bg-whatsapp hover:text-white hover:border-whatsapp dark:text-[#5fe08f]',
};

const sizes: Record<Size, string> = {
  md: 'px-5 py-3 text-[15px]',
  lg: 'px-7 py-3.5 text-base',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type LinkButtonProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: Variant;
  size?: Size;
  className?: string;
};

/** Internal, locale-aware link styled as a button */
export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

type ExternalButtonProps = ComponentProps<'a'> & { variant?: Variant; size?: Size };

export function ExternalButton({ variant, size, className, ...props }: ExternalButtonProps) {
  return <a target="_blank" rel="noopener noreferrer" className={buttonClass(variant, size, className)} {...props} />;
}
