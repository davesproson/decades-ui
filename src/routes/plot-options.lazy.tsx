import { PlotOptionsPage } from '@/plot-options/options-page'

import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/plot-options')({
  component: () => <PlotOptionsPage />,
})