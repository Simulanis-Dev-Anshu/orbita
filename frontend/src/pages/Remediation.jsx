import HubTabs from '../components/HubTabs.jsx'
import RecommendedFixes from './RecommendedFixes.jsx'
import OneClickRemediation from './OneClickRemediation.jsx'

const tabs = [
  { id: 'fixes', label: 'Recommended fixes', Component: RecommendedFixes },
  { id: 'actions', label: 'One-click actions', Component: OneClickRemediation },
]

export default function Remediation() {
  return <HubTabs tabs={tabs} />
}
