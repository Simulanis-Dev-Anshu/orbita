import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { posts } from '../../data/blog.js'

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return <Navigate to="/blog" replace />

  const others = posts.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-sub transition-colors hover:text-forest"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        All articles
      </Link>

      <header className="mt-6">
        <p className="text-xs font-semibold text-sub">
          {post.tag} · {post.date} · {post.readTime} read · {post.author}
        </p>
        <h1 className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
      </header>

      <article className="mt-8 space-y-5">
        {post.content.map((block, i) => {
          if (block.t === 'h')
            return (
              <h2 key={i} className="pt-3 text-xl font-semibold tracking-tight">
                {block.v}
              </h2>
            )
          if (block.t === 'ul')
            return (
              <ul key={i} className="space-y-2 pl-1">
                {block.v.map((li) => (
                  <li key={li} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-sub">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {li}
                  </li>
                ))}
              </ul>
            )
          return (
            <p key={i} className="text-[15px] leading-relaxed text-sub">
              {block.v}
            </p>
          )
        })}
      </article>

      {/* CTA */}
      <div className="mt-12 rounded-card bg-gradient-to-br from-forest to-forest-2 p-7 text-white">
        <h2 className="text-xl font-semibold">Find your shadow agents in 24 hours</h2>
        <p className="mt-2 text-sm text-white/60">
          Free discovery scan · read-only connectors · DPDP-aligned
        </p>
        <Link
          to="/signup"
          className="mt-5 inline-flex items-center gap-2 rounded-btn bg-brand px-5 py-2.5 text-sm font-bold text-forest transition-opacity hover:opacity-90"
        >
          Start the free scan
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      {/* Read next */}
      <section className="mt-12" aria-label="Read next">
        <h2 className="text-sm font-semibold tracking-wider text-sub uppercase">Read next</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {others.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group rounded-card bg-card p-5 shadow-soft transition-shadow hover:shadow-lift"
            >
              <p className="text-xs text-sub">
                {p.tag} · {p.readTime}
              </p>
              <p className="mt-2 text-sm font-semibold transition-colors group-hover:text-forest">
                {p.title}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
