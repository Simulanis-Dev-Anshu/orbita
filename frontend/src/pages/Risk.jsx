import HubTabs from '../components/HubTabs.jsx'
import RiskScores from './RiskScores.jsx'
import RiskExplanation from './RiskExplanation.jsx'
import AttackPaths from './AttackPaths.jsx'
import BlastRadius from './BlastRadius.jsx'

const tabs = [
  { id: 'scores', label: 'Risk scores', Component: RiskScores },
  { id: 'why', label: 'Why?', Component: RiskExplanation },
  { id: 'paths', label: 'Attack paths', Component: AttackPaths },
  { id: 'blast', label: 'Blast radius', Component: BlastRadius },
]

export default function Risk() {
  return <HubTabs tabs={tabs} />
}
