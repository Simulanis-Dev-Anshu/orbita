import { useEffect } from 'react'

function upsertMeta(attr, key, value) {
  if (!value) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

const SITE = 'https://www.orbita.io'

// Per-page SEO: title, description, canonical, Open Graph, optional JSON-LD.
export default function useSeo({ title, description, path, jsonLd, type = 'website' }) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    if (title) document.title = title

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
      upsertMeta('name', 'twitter:description', description)
    }

    if (title) {
      upsertMeta('property', 'og:title', title)
      upsertMeta('name', 'twitter:title', title)
    }

    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', 'Orbita')
    upsertMeta('name', 'twitter:card', 'summary_large_image')

    const url = path ? `${SITE}${path}` : undefined
    if (url) {
      upsertMeta('property', 'og:url', url)
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', url)
    }

    let script = document.getElementById('orbita-jsonld')
    if (jsonLdKey) {
      if (!script) {
        script = document.createElement('script')
        script.id = 'orbita-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = jsonLdKey
    }

    return () => {
      const leftover = document.getElementById('orbita-jsonld')
      if (leftover && jsonLdKey) leftover.remove()
    }
  }, [title, description, path, jsonLdKey, type])
}
