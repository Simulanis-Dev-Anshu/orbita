import HubTabs from '../components/HubTabs.jsx'
import PolicyEngine from './PolicyEngine.jsx'
import AiBom from './AiBom.jsx'
import ComplianceCenter from './ComplianceCenter.jsx'

const tabs = [
  { id: 'policies', label: 'Policies', Component: PolicyEngine },
  { id: 'bom', label: 'AI-BOM', Component: AiBom },
  { id: 'compliance', label: 'Compliance', Component: ComplianceCenter },
]

export default function Governance() {
  return <HubTabs tabs={tabs} />
}
