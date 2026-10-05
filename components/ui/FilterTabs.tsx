'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string; count?: number };

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  size?: 'md' | 'sm';
};

/** Pill tabs with a sliding active indicator. Scrolls horizontally on small screens. */
export function FilterTabs({ options, value, onChange, label, size = 'md' }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const el = listRef.current?.querySelector<HTMLButtonElement>(`[data-value="${CSS.escape(value)}"]`);
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [value, options]);

  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
      <div ref={listRef} role="group" aria-label={label} className="relative flex w-max gap-2">
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 rounded-full bg-accent transition-all duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              data-value={o.value}
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                'relative z-10 inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-full border font-semibold transition-colors duration-300',
                size === 'md' ? 'px-5 text-[15px]' : 'px-4 text-sm',
                active ? 'border-accent text-white' : 'border-line text-muted hover:border-ink/40 hover:text-ink',
                // without JS measurement yet, still show the active state
                active && !indicator && 'bg-accent',
              )}
            >
              {o.label}
              {typeof o.count === 'number' && (
                <span className={cn('text-xs', active ? 'text-white/80' : 'text-muted/80')}>{o.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
