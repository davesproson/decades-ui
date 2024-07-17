import { createFileRoute } from '@tanstack/react-router'
import { RollIndicator } from '@/roll-indicator/roll-indicator'

export const Route = createFileRoute('/roll')({
  component: () => <RollIndicator standalone={true} />,
  beforeLoad: () => {}
})