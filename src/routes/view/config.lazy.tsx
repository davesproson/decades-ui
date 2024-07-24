import { TabbedViewConfig } from '@/views/view-config'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/view/config')({
  component: () => <TabbedViewConfig />,
})