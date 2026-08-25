export const SITE = 'https://www.orbita.io'
export const UPDATED = 'August 25, 2026'

export const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Orbita',
  url: SITE,
  logo: `${SITE}/favicon.svg`,
  email: 'hello@orbita.io',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  sameAs: [],
}

export const softwareApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Orbita',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  url: SITE,
  description:
    'Orbita discovers, inventories and risk-scores every AI agent, automation, custom GPT and MCP server running in a company.',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '0',
    highPrice: '3000',
    offerCount: 3,
  },
}

export const homeFaqs = [
  {
    q: 'What is Orbita?',
    a: 'Orbita is an AI agent discovery and governance platform. It finds every AI agent, Zapier bot, custom GPT and MCP server in a company, maps a human owner, and risk-scores each one — without installing an SDK. Security teams use it to revoke orphaned agents and export DPDP, SOC 2 and ISO 27001 evidence.',
  },
  {
    q: 'What is shadow agent discovery?',
    a: 'Shadow agent discovery is finding AI agents and automations employees deployed without a security review. Orbita does this by reading OAuth grants, audit logs and DNS egress — the footprints agents already leave — rather than inspecting packets like a CASB or scanning cloud configs like a CSPM.',
  },
  {
    q: 'How is Orbita different from a CASB or CSPM?',
    a: 'CASBs inspect SaaS traffic and CSPMs audit cloud misconfiguration. Neither inventories non-human identities such as Zapier bots, custom GPTs or MCP servers. Orbita is built for that gap: a live agent inventory with owners, risk scores and a kill switch. It complements those tools; it does not replace them.',
  },
  {
    q: 'Do we need to install an SDK on our agents?',
    a: 'No. Orbita connectors are read-only. They watch OAuth grants, IdP audit logs, DNS egress and behavioral fingerprints. Nothing is installed on the agents themselves, so builders are not slowed down and discovery covers tools security never provisioned.',
  },
  {
    q: 'How long does a first discovery scan take?',
    a: 'Most teams have a live inventory within 24 hours of connecting one read-only source. Orbita customer scans find 31 or more agents on the median first run, including automations still running on departed-employee credentials.',
  },
  {
    q: 'Where is Orbita data stored?',
    a: 'Production data for Indian customers is stored in India (AWS Mumbai / ap-south-1) by default, aligned with DPDP residency expectations. EU and US regions are available, and Enterprise can self-host. Connectors do not read message bodies, file contents or email contents.',
  },
]

export const pricingFaqs = [
  {
    q: 'What does the free discovery scan include?',
    a: 'We connect read-only to up to 3 sources and give you the full inventory: every agent found, its owner, and its risk score. No credit card, and you keep the report.',
  },
  {
    q: 'Do you need to install anything on our agents?',
    a: 'No. Orbita watches OAuth grants, audit logs, DNS egress and behavioral signals — the footprints agents already leave. Nothing to instrument, no SDK.',
  },
  {
    q: 'Where is our data stored?',
    a: 'India (AWS Mumbai) by default, aligned with DPDP data-residency expectations. EU and US regions are available, and Enterprise can self-host entirely.',
  },
  {
    q: 'How is pricing counted?',
    a: 'Per company, flat. We deliberately do not charge per discovered agent — you should never be penalized for finding more shadow AI.',
  },
  {
    q: 'Can our auditor use it?',
    a: 'Yes — Growth and Enterprise include a read-only Auditor role and exportable evidence packs for DPDP, SOC 2, ISO 27001 and the EU AI Act.',
  },
]

export const comparison = [
  ['What it inventories', 'AI agents, GPTs, MCP servers, automations', 'SaaS user sessions and traffic', 'Cloud accounts and configs', 'Whatever someone remembered to log'],
  ['How it finds them', 'OAuth grants, audit logs, DNS, fingerprints', 'Inline or API traffic inspection', 'CSP APIs and posture rules', 'Manual interviews and exports'],
  ['Owner mapping', 'Every agent tied to a human or flagged orphan', 'User identity, not bot identity', 'Cloud resource tags', 'Spreadsheet columns'],
  ['Orphaned agents', 'Alert when the owner leaves the IdP', 'Out of scope', 'Out of scope', 'Caught at the next review, if at all'],
  ['Install / SDK', 'None — read-only connectors', 'Proxy, agent or API integration', 'Cloud roles and collectors', 'None'],
  ['Best for', 'Shadow AI and non-human identity', 'SaaS data leakage', 'Cloud misconfiguration', 'A one-off audit'],
]

export function faqSchema(faqs, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: `${SITE}${path}`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
