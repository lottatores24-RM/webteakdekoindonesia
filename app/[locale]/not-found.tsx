import { useTranslations } from 'next-intl';
import { LinkButton } from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('notFound');
  const nav = useTranslations('nav');
  return (
    <section className="bg-surface">
      <div className="container max-w-content py-32 text-center">
        <p className="section-label">{t('label')}</p>
        <h1 className="mt-4 font-display text-h2 font-bold text-ink">{t('title')}</h1>
        <p className="mx-auto mt-5 max-w-md text-muted">{t('text')}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/">{t('home')}</LinkButton>
          <LinkButton href="/collections" variant="outline">
            {nav('collections')}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
