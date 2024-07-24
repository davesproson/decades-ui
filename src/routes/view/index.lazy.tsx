import ViewBuilder from '@/views/view'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/view/')({
  component: () => <ViewBuilder />,
})