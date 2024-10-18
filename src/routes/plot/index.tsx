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
  caxis?: string
  job?: number | null,
}

export const Route = createFileRoute('/plot/')({
  beforeLoad: () => {}
})