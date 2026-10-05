'use client';

import { useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { sendInquiry } from '@/app/actions/inquiry';
import { inquirySchema, intents, type InquiryInput, type Intent } from '@/lib/inquiry-schema';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { buttonClass } from '@/components/ui/Button';
import { WhatsAppLink } from '@/components/layout/WhatsAppLink';

type Props = {
  /** Pre-filled product name for per-product quotes */
  product?: string;
  defaultIntent?: Intent;
  /** Read ?type=catalog|quote|question and ?product= from the URL (contact page) */
  readSearchParams?: boolean;
  className?: string;
};

const inputClass =
  'block h-12 w-full rounded border border-line bg-canvas px-4 text-[16px] text-ink placeholder:text-muted/70 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 aria-[invalid=true]:border-red-600';

export function InquiryForm({ product, defaultIntent = 'quote', readSearchParams, className }: Props) {
  const t = useTranslations('form');
  const tw = useTranslations('whatsapp');
  const tc = useTranslations('common');
  const locale = useLocale();
  const uid = useId();
  const [status, setStatus] = useState<'idle' | 'success' | 'server' | 'notConfigured'>('idle');

  const initialMessage = (intent: Intent, p?: string) =>
    p ? t('productMessage', { product: p }) : intent === 'catalog' ? t('catalogMessage') : '';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      intent: defaultIntent,
      name: '',
      company: '',
      country: '',
      email: '',
      phone: '',
      product: product ?? '',
      message: initialMessage(defaultIntent, product),
      locale,
      website: '',
    },
  });

  // Contact page: honour ?type= and ?product= without making the page dynamic
  useEffect(() => {
    if (!readSearchParams) return;
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const p = params.get('product')?.slice(0, 160);
    if (type && (intents as readonly string[]).includes(type)) setValue('intent', type as Intent);
    if (p) setValue('product', p);
    if (!getValues('message')) setValue('message', initialMessage((type as Intent) || 'quote', p || undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readSearchParams]);

  const intent = watch('intent');
  const productValue = watch('product');

  const onSubmit = async (data: InquiryInput) => {
    const res = await sendInquiry(data);
    if (res.ok) {
      setStatus('success');
      trackEvent(data.intent === 'catalog' ? 'catalog_request' : 'generate_lead', {
        intent: data.intent,
        product: data.product || undefined,
      });
    } else {
      setStatus(res.error === 'notConfigured' ? 'notConfigured' : 'server');
    }
  };

  const waMessage = productValue ? tw('productMessage', { product: productValue }) : tw('defaultMessage');

  if (status === 'success') {
    return (
      <div className={cn('rounded-lg bg-surface p-9 text-center', className)} role="status">
        <CircleCheck className="mx-auto h-12 w-12 text-accent-text" aria-hidden="true" />
        <h3 className="mt-5 font-display text-2xl font-bold text-ink">{t('success.title')}</h3>
        <p className="mx-auto mt-3 max-w-md text-muted">{t('success.text')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <WhatsAppLink message={waMessage} location="form-success">
            {tc('chatWhatsApp')}
          </WhatsAppLink>
          <button
            type="button"
            className={buttonClass('outline')}
            onClick={() => {
              reset();
              setStatus('idle');
            }}
          >
            {t('success.again')}
          </button>
        </div>
      </div>
    );
  }

  const field = (name: keyof InquiryInput) => ({
    id: `${uid}-${name}`,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
  });

  const Error = ({ name }: { name: keyof InquiryInput }) =>
    errors[name]?.message ? (
      <p id={`${uid}-${name}-error`} className="mt-1.5 text-sm text-red-700 dark:text-red-400">
        {t(`errors.${errors[name]!.message}` as 'errors.required')}
      </p>
    ) : null;

  const Label = ({
    name,
    optional,
  }: {
    name: 'name' | 'company' | 'country' | 'email' | 'phone' | 'message' | 'product';
    optional?: boolean;
  }) => (
    <label htmlFor={`${uid}-${name}`} className="mb-2 block text-sm font-semibold text-ink">
      {t(name)}
      {optional ? (
        <span className="font-normal text-muted"> ({t('optional')})</span>
      ) : (
        <span className="text-accent-text"> *</span>
      )}
    </label>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn('relative rounded-lg bg-canvas p-6 ring-1 ring-line sm:p-9', className)}
    >
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">{t('intent')}</legend>
        <div className="flex flex-wrap gap-2">
          {intents.map((i) => (
            <label
              key={i}
              className={cn(
                'inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-4 text-sm font-semibold transition',
                intent === i
                  ? 'border-accent bg-accent text-white'
                  : 'border-line text-muted hover:border-ink/40 hover:text-ink',
              )}
            >
              <input type="radio" value={i} {...register('intent')} className="sr-only" />
              {t(`intents.${i}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <Label name="name" />
          <input
            {...field('name')}
            {...register('name')}
            autoComplete="name"
            placeholder={t('placeholders.name')}
            className={inputClass}
          />
          <Error name="name" />
        </div>
        <div>
          <Label name="company" optional />
          <input
            {...field('company')}
            {...register('company')}
            autoComplete="organization"
            placeholder={t('placeholders.company')}
            className={inputClass}
          />
          <Error name="company" />
        </div>
        <div>
          <Label name="country" />
          <input
            {...field('country')}
            {...register('country')}
            autoComplete="country-name"
            placeholder={t('placeholders.country')}
            className={inputClass}
          />
          <Error name="country" />
        </div>
        <div>
          <Label name="email" />
          <input
            {...field('email')}
            {...register('email')}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t('placeholders.email')}
            className={inputClass}
          />
          <Error name="email" />
        </div>
        <div className={cn(!productValue && 'md:col-span-2')}>
          <Label name="phone" optional />
          <input
            {...field('phone')}
            {...register('phone')}
            type="tel"
            autoComplete="tel"
            placeholder={t('placeholders.phone')}
            className={inputClass}
          />
          <Error name="phone" />
        </div>
        {productValue ? (
          <div>
            <Label name="product" optional />
            <input {...field('product')} {...register('product')} className={inputClass} />
          </div>
        ) : (
          <input type="hidden" {...register('product')} />
        )}
        <div className="md:col-span-2">
          <Label name="message" />
          <textarea
            {...field('message')}
            {...register('message')}
            rows={5}
            placeholder={t('placeholders.message')}
            className={cn(inputClass, 'h-auto min-h-[140px] py-3')}
          />
          <Error name="message" />
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>
      <input type="hidden" {...register('locale')} />

      {(status === 'server' || status === 'notConfigured') && (
        <p
          role="alert"
          className="mt-6 rounded bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-300"
        >
          {t(`errors.${status}`)}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={isSubmitting} className={buttonClass('primary', 'lg')}>
          {isSubmitting ? t('sending') : t(`submit.${intent}`)}
        </button>
        <WhatsAppLink message={waMessage} location="form" size="lg">
          {tc('chatWhatsApp')}
        </WhatsAppLink>
      </div>
      <p className="mt-4 text-sm text-muted">{t('privacy')}</p>
    </form>
  );
}
