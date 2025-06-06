import { createFileRoute } from '@tanstack/react-router'

type ViewSearchParams = {
  view: string | undefined
}

export const Route = createFileRoute('/view/')({

  validateSearch: (search: Record<string, unknown>): ViewSearchParams => {
    return {
      view: search.view ? String(search.view) : undefined,
    }
  },
  beforeLoad: () => { }
})