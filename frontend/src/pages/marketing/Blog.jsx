import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { posts } from '../../data/blog.js'
import useReveal from '../../hooks/useReveal.js'
import useSeo from '../../hooks/useSeo.js'

const tagColors = {
  Research: 'bg-brand-soft text-forest',
  Compliance: 'bg-warn-soft text-warn',
  Security: 'bg-danger-soft text-danger',
  Engineering: 'bg-canvas text-sub',
}

function PostCard({ post, featured }) {
  const ref = useReveal()
  return (
    <article
      ref={ref}
      className={`reveal group rounded-card bg-card shadow-soft transition-shadow hover:shadow-lift ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <Link to={`/blog/${post.slug}`} className="flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-center gap-3 text-xs">
          <span className={`rounded-full px-2.5 py-1 font-semibold ${tagColors[post.tag]}`}>
            {post.tag}
          </span>
          <span className="text-sub">
            {post.date} · {post.readTime} read
          </span>
        </div>
        <h2
          className={`mt-4 font-semibold tracking-tight transition-colors group-hover:text-forest ${
            featured ? 'text-2xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-sub">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
          Read article
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </article>
  )
}

export default function Blog() {
  const [featured, ...rest] = posts
  useSeo({
    title: 'The Shadow Ledger — Orbita research on shadow AI',
    description:
      'Research and field notes on shadow AI, MCP servers, orphaned agents and DPDP compliance — from the Orbita discovery team.',
    path: '/blog',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'The Shadow Ledger',
      url: 'https://www.orbita.io/blog',
      description:
        'Research and field notes on shadow AI, agent governance and DPDP compliance.',
    },
  })
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <p className="ox-label">Journal</p>
      <h1 className="font-display mt-3.5 text-[clamp(38px,4.3vw,58px)] tracking-[-0.038em]">
        The Shadow Ledger
      </h1>
      <p className="ox-lead mt-[18px]">
        Research and field notes on shadow AI, agent governance and DPDP compliance, from the
        Orbita discovery team.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <PostCard post={featured} featured />
        {rest.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </main>
  )
}
