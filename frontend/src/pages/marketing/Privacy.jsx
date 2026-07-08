import LegalShell from '../../components/marketing/LegalShell.jsx'
import useSeo from '../../hooks/useSeo.js'

const sections = [
  {
    id: 'who-we-are',
    h: 'Who we are',
    body: [
      'Orbita ("we", "us") provides a discovery and governance platform that helps organisations inventory and risk-score the AI agents operating on their systems. This policy explains what personal data we collect, why we collect it, and the choices you have. It applies to www.orbita.io, app.orbita.io and related services.',
      'For customers in India, Orbita acts as a Data Processor under the Digital Personal Data Protection Act, 2023 (DPDP Act) when processing data on behalf of a customer, and as a Data Fiduciary for the account and website data described below.',
    ],
  },
  {
    id: 'data-we-collect',
    h: 'Data we collect',
    body: ['We collect only what we need to run the service:'],
    list: [
      'Account data — name, work email, company name and role when you sign up or are invited to a workspace.',
      'Discovery metadata — when you connect a source (e.g. Google Workspace, Slack, GitHub), we read metadata about automations: OAuth grant scopes, agent names, owners, activity timestamps. Connectors are read-only; we do not read message bodies, file contents or email contents.',
      'Usage data — pages visited, features used and device/browser information, used to improve the product.',
      'Support data — the contents of messages you send to our support and sales teams.',
    ],
  },
  {
    id: 'how-we-use',
    h: 'How we use your data',
    list: [
      'To provide the service: building your agent inventory, computing risk scores and sending the alerts you configure.',
      'To secure the service: fraud prevention, abuse detection and audit logging.',
      'To improve the product: aggregate, de-identified analytics on feature usage.',
      'To communicate: service notices, security alerts and — only with consent — product updates and our newsletter.',
    ],
    body: ['We never sell personal data, and we never use customer discovery metadata to train models shared across customers.'],
  },
  {
    id: 'cookies',
    h: 'Cookies',
    body: [
      'We use a small number of cookies and similar technologies. You can change your choice at any time via "Cookie preferences" in the footer.',
    ],
    list: [
      'Essential cookies — session authentication, security (CSRF protection) and remembering your cookie choice itself. These are required for the site to function and cannot be switched off.',
      'Analytics cookies (optional) — help us understand which pages and features are used so we can improve the product. Set only if you choose "Accept all".',
      'We do not use advertising or cross-site tracking cookies.',
    ],
  },
  {
    id: 'residency',
    h: 'Data residency & transfers',
    body: [
      'Production data for Indian customers is stored in data centres located in India. For customers who opt into features that call external model APIs, we document each such transfer in your compliance workspace so you can meet your own DPDP cross-border obligations.',
      'Where data is transferred outside your region, we rely on contractual safeguards with our sub-processors. A current list of sub-processors is available on request.',
    ],
  },
  {
    id: 'retention',
    h: 'Retention',
    body: [
      'Account data is kept for the life of your account and deleted within 30 days of account closure. Discovery metadata is retained for 12 months by default (configurable per workspace) to support audit-log requirements, then deleted. Backups roll off within a further 35 days.',
    ],
  },
  {
    id: 'your-rights',
    h: 'Your rights',
    body: [
      'Depending on your jurisdiction (including under the DPDP Act and GDPR), you may have rights to access, correct, delete or port your personal data, and to withdraw consent. To exercise any of these, email privacy@orbita.io — we respond within 30 days. You may also lodge a complaint with your local data protection authority, including the Data Protection Board of India.',
    ],
  },
  {
    id: 'security',
    h: 'Security',
    body: [
      'All data is encrypted in transit (TLS 1.2+) and at rest (AES-256). Access to production systems requires SSO and hardware-key MFA, and every access is logged. We run our own platform on Orbita — every internal automation is inventoried and risk-scored.',
    ],
  },
  {
    id: 'changes',
    h: 'Changes to this policy',
    body: [
      'When we make material changes we will notify workspace owners by email and update the date at the top of this page at least 14 days before the changes take effect.',
    ],
  },
]

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy — Orbita',
    description:
      'How Orbita collects, uses and protects your data: read-only connectors, India data residency, DPDP-aligned processing, cookies and your rights.',
    path: '/privacy',
  })

  return (
    <LegalShell
      title="Privacy Policy"
      updated="July 9, 2026"
      intro="Your trust is the product. This policy describes, in plain language, what data Orbita collects, why we collect it, where it lives and the rights you have over it. The short version: read-only connectors, metadata only, stored in India for Indian customers, never sold."
      sections={sections}
    />
  )
}
