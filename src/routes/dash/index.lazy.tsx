import DashboardDispatcher from '@/dashboard/dashboard'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dash/')({
  component: () => <DashboardDispatcher />,
})