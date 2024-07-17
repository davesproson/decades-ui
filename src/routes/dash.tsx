import { createFileRoute } from '@tanstack/react-router'

import DashboardDispatcher from '@/dashboard/dashboard'

export const Route = createFileRoute('/dash')({
  component: () => <DashboardDispatcher />,
  beforeLoad: () => {},
})