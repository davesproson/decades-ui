import { createFileRoute } from '@tanstack/react-router'

export type IndexSearch = {
  job?: number,
  darkMode?: boolean,
  paramset?: string,
}

export const Route = createFileRoute('/')({
  staleTime: Infinity,
  beforeLoad: () => {},
})

