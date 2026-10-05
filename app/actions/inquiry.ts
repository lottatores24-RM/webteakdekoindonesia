'use server';

import { inquirySchema, type InquiryInput, type InquiryResult } from '@/lib/inquiry-schema';
import { site } from '@/lib/site';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const intentLabel = { quote: 'Quote request', catalog: 'E-catalog request', question: 'Question' } as const;

/** Validates the inquiry and emails it to the company via the Resend HTTP API. */
export async function sendInquiry(input: InquiryInput): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'invalid' };
  const data = parsed.data;

  // Bots fill the hidden field; pretend success so they learn nothing
  if (data.website) return { ok: true };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[inquiry] RESEND_API_KEY is not set — inquiry not sent', { email: data.email });
    return { ok: false, error: 'notConfigured' };
  }

  const to = (process.env.INQUIRY_TO_EMAIL || site.email)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.INQUIRY_FROM_EMAIL || 'Teak & Deko Website <onboarding@resend.dev>';

  const rows: [string, string | undefined][] = [
    ['Type', intentLabel[data.intent]],
    ['Product', data.product],
    ['Name', data.name],
    ['Company', data.company],
    ['Country', data.country],
    ['Email', data.email],
    ['Phone / WhatsApp', data.phone],
    ['Site language', data.locale.toUpperCase()],
  ];

  const html = `
    <h2 style="font-family:Georgia,serif;color:#8E2B25">${intentLabel[data.intent]} — ${escape(data.name)}</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="color:#6B665C">${k}</td><td><strong>${escape(v!)}</strong></td></tr>`)
        .join('')}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;border-left:3px solid #8E2B25;padding-left:12px">${escape(data.message)}</p>
  `;

  const text = [...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), '', data.message].join('\n');

  const subjectProduct = data.product ? ` — ${data.product}` : '';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject: `[Website] ${intentLabel[data.intent]}${subjectProduct} — ${data.name} (${data.country})`,
        html,
        text,
      }),
    });
    if (!res.ok) {
      console.error('[inquiry] Resend error', res.status, await res.text());
      return { ok: false, error: 'server' };
    }
    return { ok: true };
  } catch (err) {
    console.error('[inquiry] send failed', err);
    return { ok: false, error: 'server' };
  }
}
