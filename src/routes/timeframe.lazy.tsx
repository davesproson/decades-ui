import Loader from '@/components/loader'
import { Timeframe } from '@/timeframe/timeframe-page'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/timeframe')({
  component: () => <Timeframe />,
  pendingComponent: () => <Loader />,
})

