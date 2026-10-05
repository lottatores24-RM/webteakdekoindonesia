'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Fades in every element with [data-reveal] when it enters the viewport.
 * One observer for the whole page; also picks up elements added later (filtered grids).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const observe = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((el) => io.observe(el));
    observe(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (n.matches('[data-reveal]')) io.observe(n);
            observe(n);
          }
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
