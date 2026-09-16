export default function SeoFaq({ items, eyebrow = 'FAQ', title = 'Frequently asked questions' }) {
  return (
    <section aria-label="Frequently asked questions">
      <p className="ox-label text-center">{eyebrow}</p>
      <h2 className="font-display mt-3.5 text-center text-[clamp(28px,3vw,40px)] text-ink">{title}</h2>
      <div className="mx-auto mt-10 max-w-2xl border-t border-line">
        {items.map((f, i) => (
          <details
            key={f.q}
            name="faq"
            className="group border-b border-line"
            defaultOpen={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[15px] font-medium text-ink transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                className="shrink-0 text-lg leading-none text-sub transition-transform duration-200 group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="pb-5 pr-10 text-[15px] leading-relaxed text-ink-2">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
