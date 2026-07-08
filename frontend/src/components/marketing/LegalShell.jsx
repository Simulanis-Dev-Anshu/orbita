import { Link } from 'react-router-dom'

// Shared layout for legal pages (privacy, terms). Sections render as
// headed blocks with optional paragraphs and bullet lists.
export default function LegalShell({ title, updated, intro, sections }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold tracking-wider text-sub uppercase">Legal</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-sub">Last updated: {updated}</p>

      <div className="mt-8 rounded-card bg-card p-6 shadow-soft sm:p-10">
        <p className="text-sm leading-relaxed text-sub">{intro}</p>

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
              <p key={j} className="mt-3 text-sm leading-relaxed text-sub">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="mt-3 space-y-2">
                {s.list.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-sub">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="mt-10 border-t border-line pt-6 text-sm leading-relaxed text-sub">
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
