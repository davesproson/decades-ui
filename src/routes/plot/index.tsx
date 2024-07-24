import { createFileRoute } from '@tanstack/react-router'

export type PlotSearchParams = {
  timeframe: string,
  ordvar: string,
  params: string,
  axis: string[],
  swapxy: boolean,
  scrolling: boolean,
  data_header: boolean,
  style?: string,
  job?: number | null,
}

export const Route = createFileRoute('/plot/')({
  validateSearch: (search: Record<string, unknown>): PlotSearchParams => {
    return {
      timeframe: String(search.timeframe || '30min'),
      ordvar: String(search.ordvar || 'utc_time'),
      params: String(search.params || ''),
      axis: Array.isArray(search.axis) ? search.axis : [search.axis],
      swapxy: Boolean(search.swapxy || false),
      scrolling: Boolean(search.scrolling || true),
      data_header: Boolean(search.header || false),
      style: String(search.style || 'line'),
      job: search.job ? Number(search.job) : null,
    }
  },

  beforeLoad: () => {}
})