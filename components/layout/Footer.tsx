import { Mail, MapPin, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link, type Locale } from '@/lib/i18n';
import { mainNav, site } from '@/lib/site';
import { categories } from '@/lib/products';
import { telHref, whatsappUrl } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Logo } from './Logo';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const year = new Date().getFullYear();

  const linkClass =
    'inline-flex min-h-[40px] items-center text-oncream/80 transition hover:text-white hover:underline underline-offset-4';

  return (
    <footer className="bg-forest text-oncream">
      <div className="container max-w-content py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo alt={t('common.logoAlt')} variant="light" className="h-14" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-oncream/80">{t('footer.about')}</p>
            <p className="mt-4 text-sm text-oncream/75">{t('footer.established')}</p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="text-xs font-bold uppercase tracking-[0.12em] text-[#E8A79F]">
              {t('footer.explore')}
            </h2>
            <ul className="mt-5 space-y-1 text-[15px]">
              <li>
                <Link href="/" className={linkClass}>
                  {t('nav.home')}
                </Link>
              </li>
              {mainNav.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={linkClass}>
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-collections">
            <h2 id="footer-collections" className="text-xs font-bold uppercase tracking-[0.12em] text-[#E8A79F]">
              {t('footer.collections')}
            </h2>
            <ul className="mt-5 space-y-1 text-[15px]">
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/collections/${c}`} className={linkClass}>
                    {t(`categories.${c}.name`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/request-catalog" className={linkClass}>
                  {t('nav.requestCatalog')}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#E8A79F]">{t('footer.contact')}</h2>
            <address className="mt-5 space-y-4 text-[15px] not-italic text-oncream/80">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#E8A79F]" aria-hidden="true" />
                <span>{site.address.full}</span>
              </p>
              {site.contacts.map((c) => (
                <p key={c.wa} className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#E8A79F]" aria-hidden="true" />
                  <span>
                    {c.name}
                    <br />
                    <a href={telHref(c.phone)} className="hover:text-white hover:underline">
                      {c.phone}
                    </a>
                    {' · '}
                    <a
                      href={whatsappUrl(t('whatsapp.defaultMessage'), c.wa)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-white hover:underline"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </span>
                </p>
              ))}
              <p className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#E8A79F]" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="hover:text-white hover:underline">
                  {site.email}
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex max-w-content flex-col gap-2 py-6 text-sm text-oncream/75 md:flex-row md:items-center md:justify-between">
          <p>{t('footer.rights', { year })}</p>
          <p className="italic">{t('footer.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
