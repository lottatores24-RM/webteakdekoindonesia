import 'server-only';
import type { ReactNode } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { Locale } from './i18n';

/**
 * Renders a product MDX body. Each file holds both languages:
 *   <En>English text…</En>
 *   <Id>Teks Indonesia…</Id>
 * Only the block for the current locale is rendered.
 */
export async function renderProductBody(source: string, locale: Locale) {
  const only = (l: Locale) =>
    function LocaleBlock({ children }: { children: ReactNode }) {
      return l === locale ? <>{children}</> : null;
    };

  const { content } = await compileMDX({
    source,
    components: {
      En: only('en'),
      Id: only('id'),
      p: (props) => <p className="leading-relaxed" {...props} />,
    },
  });
  return content;
}
