import PlotDispatcher from '@/plot/plot'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/plot/')({
  component: () => <PlotDispatcher />,
})