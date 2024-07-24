import { createFileRoute } from '@tanstack/react-router'

export type TephigramSearchParams = {
  timeframe: string,
  params: string,
}

export const Route = createFileRoute('/tephigram/')({
  beforeLoad: () => {}
  // validateSearch: (search: Record<string, unknown>): TephigramSearchParams => {
  //   return {
  //     timeframe: search.timeframe ? String(search.timeframe) : "30min",
  //     params: search.params ? String(search.params) : "deiced_true_air_temp_c,dew_point",
  //   }
  // }
})