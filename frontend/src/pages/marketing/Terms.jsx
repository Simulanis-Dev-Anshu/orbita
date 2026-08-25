import LegalShell from '../../components/marketing/LegalShell.jsx'
import useSeo from '../../hooks/useSeo.js'

const sections = [
  {
    id: 'acceptance',
    h: 'Acceptance of terms',
    body: [
      'These Terms & Conditions ("Terms") govern your access to and use of the Orbita platform, website and related services. By creating an account, running a scan or otherwise using the service, you agree to these Terms on behalf of yourself and the organisation you represent. If you do not agree, do not use the service.',
    ],
  },
  {
    id: 'service',
    h: 'The service',
    body: [
      'Orbita discovers, inventories and risk-scores AI agents, automations and MCP servers operating within your organisation, using read-only connectors you authorise. Risk scores, classifications and compliance summaries are decision-support information. They assist, but do not replace, your own security judgment.',
    ],
  },
  {
    id: 'accounts',
    h: 'Accounts & authorised use',
    list: [
      'You must provide accurate account information and keep credentials confidential.',
      'You may only connect data sources you are authorised to connect on behalf of your organisation.',
      'Workspace owners are responsible for the actions of users they invite, including auditors granted read-only access.',
      'You must be at least 18 years old to use the service.',
    ],
  },
  {
    id: 'acceptable-use',
    h: 'Acceptable use',
    body: ['You agree not to:'],
    list: [
      'Use the service to monitor systems or organisations you do not own or lack authorisation to monitor.',
      'Probe, disrupt or circumvent the security of the platform, or exceed the scopes granted to your connectors.',
      'Resell, sublicense or provide the service to third parties except as agreed in an enterprise contract.',
      'Reverse-engineer the platform or use it to build a competing product.',
    ],
  },
  {
    id: 'customer-data',
    h: 'Customer data & privacy',
    body: [
      'You retain all rights to your data. You grant Orbita a limited licence to process it solely to provide and secure the service, as described in our Privacy Policy. We process personal data on your behalf as a Data Processor under the DPDP Act 2023 and, where applicable, under a Data Processing Agreement.',
    ],
  },
  {
    id: 'fees',
    h: 'Fees & billing',
    body: [
      'Paid plans are billed in advance, monthly or annually, at the prices shown on our pricing page or in your order form. Fees are non-refundable except where required by law or expressly stated. We may change prices with 30 days’ notice, effective at your next renewal. Taxes (including GST) are your responsibility unless stated otherwise.',
    ],
  },
  {
    id: 'ip',
    h: 'Intellectual property',
    body: [
      'Orbita and its licensors own the platform, including software, models, designs and documentation. Feedback you provide may be used to improve the service without obligation. Nothing in these Terms transfers ownership of either party’s pre-existing intellectual property.',
    ],
  },
  {
    id: 'disclaimers',
    h: 'Disclaimers',
    body: [
      'The service is provided "as is". Discovery is heuristic by nature: we do not warrant that every agent, credential or data flow in your environment will be found, or that risk scores are error-free. You remain responsible for your organisation’s security and compliance decisions.',
    ],
  },
  {
    id: 'liability',
    h: 'Limitation of liability',
    body: [
      'To the maximum extent permitted by law, neither party is liable for indirect, incidental, special or consequential damages, or loss of profits, revenue or data. Each party’s total aggregate liability under these Terms is limited to the fees paid or payable by you in the 12 months preceding the claim. Nothing limits liability for fraud, wilful misconduct or breaches of confidentiality obligations.',
    ],
  },
  {
    id: 'termination',
    h: 'Suspension & termination',
    body: [
      'You may cancel at any time from Settings; access continues until the end of the paid period. We may suspend or terminate access for material breach of these Terms (including acceptable-use violations) with notice where practicable. Upon termination we delete customer data per the retention schedule in the Privacy Policy.',
    ],
  },
  {
    id: 'law',
    h: 'Governing law & disputes',
    body: [
      'These Terms are governed by the laws of India. Courts in New Delhi, India have exclusive jurisdiction, and each party consents to that venue. Before filing a claim, both parties agree to attempt good-faith resolution via legal@orbita.io for 30 days.',
    ],
  },
  {
    id: 'changes',
    h: 'Changes to these terms',
    body: [
      'We may update these Terms from time to time. Material changes will be notified to workspace owners by email at least 14 days before taking effect. Continued use of the service after the effective date constitutes acceptance.',
    ],
  },
]

export default function Terms() {
  useSeo({
    title: 'Terms & Conditions | Orbita',
    description:
      'The terms governing your use of Orbita: accounts, acceptable use, customer data, fees, disclaimers, liability and governing law.',
    path: '/terms',
  })

  return (
    <LegalShell
      title="Terms & Conditions"
      updated="July 9, 2026"
      intro="These terms keep expectations clear on both sides: what Orbita provides, what you're responsible for, and how we handle data, billing and disputes. Written to be read, not skimmed past."
      sections={sections}
    />
  )
}
