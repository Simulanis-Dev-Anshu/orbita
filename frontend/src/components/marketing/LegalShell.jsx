import { Link } from 'react-router-dom'

// Shared layout for legal pages (privacy, terms). Sections render as
// headed blocks with optional paragraphs and bullet lists.
export default function LegalShell({ title, updated, intro, sections }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="ox-label text-ink">Legal</p>
      <h1 className="font-display mt-2 text-[clamp(32px,4vw,48px)] tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-ink-2">Last updated: {updated}</p>

      <div className="mt-8 rounded-card bg-card p-6 shadow-soft sm:p-10">
        <p className="text-[16px] leading-relaxed text-ink-2">{intro}</p>

        <nav aria-label="On this page" className="mt-6 rounded-2xl bg-canvas p-4">
          <p className="text-xs font-semibold tracking-wider text-sub uppercase">On this page</p>
          <ol className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-forest transition-colors hover:underline">
                  {i + 1}. {s.h}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="mt-8 scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight">
              {i + 1}. {s.h}
            </h2>
            {s.body?.map((p, j) => (
              <p key={j} className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="mt-3 space-y-2">
                {s.list.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-[15.5px] leading-relaxed text-ink-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="mt-10 border-t border-line pt-6 text-[15.5px] leading-relaxed text-ink-2">
          Questions about this policy? Write to{' '}
          <a href="mailto:legal@orbita.io" className="font-semibold text-forest hover:underline">
            legal@orbita.io
          </a>{' '}
          or see our <Link to="/about" className="font-semibold text-forest hover:underline">About page</Link>{' '}
          for company details.
        </p>
      </div>
    </main>
  )
}
