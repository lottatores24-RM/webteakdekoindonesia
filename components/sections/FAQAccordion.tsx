import { Plus } from 'lucide-react';

type Item = { q: string; a: string };

/**
 * Native <details> accordion: works without JavaScript, every question is a real heading
 * and every answer stays in the HTML for search engines.
 */
export function FAQAccordion({ items, headingLevel = 3 }: { items: Item[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-line" data-reveal>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <H className="text-lg font-semibold text-ink">{item.q}</H>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-accent-text transition group-hover:bg-surface">
              <Plus className="h-5 w-5 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
            </span>
          </summary>
          <div className="faq-answer">
            <p className="pb-6 pr-12 leading-relaxed text-muted">{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
