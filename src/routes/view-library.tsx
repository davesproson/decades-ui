import { createFileRoute } from '@tanstack/react-router'

import { ViewLibrary } from '@/views/view-library'

export const Route = createFileRoute('/view-library')({
  component: () => <ViewLibrary />
})