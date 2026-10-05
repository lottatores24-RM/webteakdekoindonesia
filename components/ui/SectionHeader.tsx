import { cn } from '@/lib/utils';

type Props = {
  label: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  tone?: 'default' | 'dark';
  className?: string;
};

export function SectionHeader({
  label,
  title,
  intro,
  align = 'left',
  as: Tag = 'h2',
  tone = 'default',
  className,
}: Props) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)} data-reveal>
      <p className={cn('section-label', tone === 'dark' && 'text-[#E8A79F]')}>{label}</p>
      <Tag
        className={cn(
          'mt-4 font-display font-bold',
          Tag === 'h1' ? 'text-hero font-extrabold' : 'text-h2',
          tone === 'dark' ? 'text-oncream' : 'text-ink',
        )}
      >
        {title}
      </Tag>
      {intro && <p className={cn('mt-5 text-body', tone === 'dark' ? 'text-oncream/80' : 'text-muted')}>{intro}</p>}
    </div>
  );
}
