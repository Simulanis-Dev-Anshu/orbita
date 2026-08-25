import LegalShell from '../../components/marketing/LegalShell.jsx'
import useSeo from '../../hooks/useSeo.js'

const sections = [
  {
    id: 'posture',
    h: 'Security posture',
    body: [
      'Orbita is a read-only discovery platform. Connectors request the minimum OAuth scopes needed to list automations, grants and audit metadata. We do not read message bodies, file contents or email contents, and we never use customer discovery metadata to train shared models.',
    ],
  },
  {
    id: 'encryption',
    h: 'Encryption & access',
    list: [
      'Data in transit: TLS 1.2 or newer.',
      'Data at rest: AES-256.',
      'Production access requires SSO and hardware-key MFA; every access is logged.',
      'We run Orbita on Orbita — internal automations are inventoried and risk-scored the same way customers’ are.',
    ],
  },
  {
    id: 'residency',
    h: 'Data residency',
    body: [
      'Indian customer production data is stored in India (AWS Mumbai, ap-south-1) by default, aligned with DPDP Act 2023 residency expectations. EU and US regions are available. Enterprise can self-host. Cross-border model-API calls, if you opt in, are documented in the compliance workspace.',
    ],
  },
  {
    id: 'subprocessors',
    h: 'Sub-processors',
    body: [
      'Infrastructure is hosted on AWS. Transactional email and error monitoring use named vendors under DPA. A current sub-processor list is available on request at security@orbita.io. We do not sell personal data.',
    ],
  },
  {
    id: 'report',
    h: 'Report a vulnerability',
    body: [
      'Email security@orbita.io. Please include steps to reproduce and avoid accessing other customers’ data. We acknowledge reports within 3 business days. Do not open a public GitHub issue for security findings.',
    ],
  },
]

export default function Security() {
  useSeo({
    title: 'Security — Orbita',
    description:
      'How Orbita protects customer data: read-only connectors, TLS and AES-256, India data residency, SSO and hardware-key MFA, and how to report a vulnerability.',
    path: '/security',
  })

  return (
    <LegalShell
      title="Security"
      updated="August 25, 2026"
      intro="Read-only connectors, metadata only, encrypted in transit and at rest, stored in India for Indian customers. This page is the public summary; enterprise questionnaires go to security@orbita.io."
      sections={sections}
    />
  )
}
