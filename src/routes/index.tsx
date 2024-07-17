import Loader from '@/components/loader'
import { apiEndpoints } from '@/settings'
import { createFileRoute } from '@tanstack/react-router'

export type IndexSearch = {
  job?: number,
  darkMode?: boolean,
  paramset?: string,
}

export const Route = createFileRoute('/')({
  staleTime: Infinity,
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    return {
      job: Number(search.job) || undefined,
      darkMode: Boolean(search.darkMode) || undefined,
      paramset: String(search.paramset || ''),
    }
  },
  loaderDeps: ({ search: { paramset } }) => ({ paramset, darkMode: false }),
  beforeLoad: ({ search }) => {
    console.log('Index Preload', search)
  },
  loader: async ({deps: {paramset, darkMode}}) => {
    console.log('Index Loader', paramset, darkMode)
    const dataUrl = new URL(window.origin)
    dataUrl.pathname = apiEndpoints.parameter_availability
    if(paramset) {
      dataUrl.searchParams.set('params', paramset === 'default' ? '' : paramset)
    }
    const response = await fetch(dataUrl.toString())
    return await response.json()
    
  },
  pendingComponent: () => <Loader />,
})

