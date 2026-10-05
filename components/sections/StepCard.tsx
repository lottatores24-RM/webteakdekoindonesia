import type { ReactNode } from 'react';

type Props = { number: number; title: string; text: string; icon: ReactNode; action?: ReactNode; index?: number };

export function StepCard({ number, title, text, icon, action, index = 0 }: Props) {
  return (
    <li
      className="relative flex flex-col rounded-lg bg-canvas p-8 ring-1 ring-line"
      data-reveal
      style={{ ['--reveal-delay' as string]: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent font-display text-2xl font-bold text-white">
          {number}
        </span>
        <span className="text-accent-text/70" aria-hidden="true">
          {icon}
        </span>
      </div>
      <h3 className="mt-8 font-display text-2xl font-bold text-ink">{title}</h3>
      <p className="mt-3 flex-1 leading-relaxed text-muted">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </li>
  );
}
