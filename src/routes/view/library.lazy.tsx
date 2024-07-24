import { ViewLibrary } from '@/views/view-library'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/view/library')({
  component: () => <ViewLibrary />,
})