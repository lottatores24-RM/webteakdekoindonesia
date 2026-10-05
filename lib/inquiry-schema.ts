import { z } from 'zod';

export const intents = ['quote', 'catalog', 'question'] as const;
export type Intent = (typeof intents)[number];

/** Error messages are translation keys under form.errors */
export const inquirySchema = z.object({
  intent: z.enum(intents),
  name: z.string().trim().min(1, 'required').max(120, 'tooLong'),
  company: z.string().trim().max(160, 'tooLong').optional().or(z.literal('')),
  country: z.string().trim().min(1, 'required').max(80, 'tooLong'),
  email: z.string().trim().min(1, 'required').email('email').max(160, 'tooLong'),
  phone: z.string().trim().max(40, 'tooLong').optional().or(z.literal('')),
  product: z.string().trim().max(160, 'tooLong').optional().or(z.literal('')),
  message: z.string().trim().min(5, 'tooShort').max(4000, 'tooLong'),
  locale: z.string().max(5),
  /** Honeypot — must stay empty */
  website: z.string().max(0).optional().or(z.literal('')),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryResult = { ok: true } | { ok: false; error: 'invalid' | 'server' | 'notConfigured' };
