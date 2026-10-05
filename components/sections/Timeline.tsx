type Item = { year: string; title: string; text: string };

/** Vertical timeline on mobile, horizontal with dots on a line from lg up */
export function Timeline({ items }: { items: Item[] }) {
  return (
    <ol className="relative grid gap-10 border-l-2 border-line pl-8 lg:grid-cols-5 lg:gap-6 lg:border-l-0 lg:pl-0">
      {/* horizontal line (desktop) */}
      <span aria-hidden="true" className="absolute left-0 right-0 top-[54px] hidden h-0.5 bg-line lg:block" />
      {items.map((item, i) => (
        <li key={item.year} className="relative" data-reveal style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}>
          <span
            aria-hidden="true"
            className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-canvas bg-accent ring-2 ring-accent lg:left-0 lg:top-[47px]"
          />
          <p className="font-display text-xl font-bold text-accent-text lg:h-10 lg:text-lg">{item.year}</p>
          <div className="mt-2 lg:mt-14">
            <h3 className="font-bold text-ink">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
