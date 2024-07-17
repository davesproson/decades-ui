import { createFileRoute } from '@tanstack/react-router'
import ViewBuilder from '@/views/view'

type ViewSearchParams = {
  view: string | undefined
}

export const Route = createFileRoute('/view')({
  component: () => <ViewBuilder />,
  validateSearch: (search: Record<string, unknown>): ViewSearchParams => {
    return {
      view: search.view ? String(search.view) : undefined,
    }
  },
  beforeLoad: () => {}
})