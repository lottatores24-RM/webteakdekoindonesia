import { LinkButton } from '@/components/ui/Button';
import { WhatsAppLink } from '@/components/layout/WhatsAppLink';

type Props = {
  title: string;
  text: string;
  primaryLabel: string;
  primaryHref?: string;
  whatsappLabel: string;
  whatsappMessage: string;
  location: string;
};

/** Dark forest-green call-to-action band */
export function CtaBand({
  title,
  text,
  primaryLabel,
  primaryHref = '/request-catalog',
  whatsappLabel,
  whatsappMessage,
  location,
}: Props) {
  return (
    <section className="bg-forest text-oncream">
      <div className="container max-w-content py-24 lg:py-[120px]">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <h2 className="font-display text-h2 font-bold text-oncream">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-body text-oncream/85">{text}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href={primaryHref} size="lg">
              {primaryLabel}
            </LinkButton>
            <WhatsAppLink message={whatsappMessage} location={location} variant="outline-light" size="lg">
              {whatsappLabel}
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
