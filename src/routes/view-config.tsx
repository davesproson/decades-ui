import { createFileRoute } from '@tanstack/react-router'
import { TabbedViewConfig } from '@/views/view-config'

export const Route = createFileRoute('/view-config')({
  component: () => <TabbedViewConfig />,
  beforeLoad: () => {}
})