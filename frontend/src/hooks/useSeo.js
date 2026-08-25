import { useEffect } from 'react'

const SITE = 'https://www.orbita.io'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function useSeo({ title, description, path, type = 'website', jsonLd, noindex }) {
  const json = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    if (title) document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    const url = path ? `${SITE}${path}` : undefined
    upsertLink('canonical', url)

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', 'Orbita')
    upsertMeta('name', 'twitter:card', 'summary')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)

    document.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove())
    if (json) {
      const parsed = JSON.parse(json)
      for (const block of Array.isArray(parsed) ? parsed : [parsed]) {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.dataset.seoJsonld = '1'
        script.textContent = JSON.stringify(block)
        document.head.appendChild(script)
      }
    }

    return () => {
      document.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove())
    }
  }, [title, description, path, type, json, noindex])
}
