import { useSelector } from '@store'
import { base as siteBase } from '@/settings'
import { usePollingData } from '@/data/hooks';
import type { DashboardOptions } from './types';
import type { DecadesDataResponse } from '@/data/types';

const useDashboardUrl = () => {
  const params = useSelector(state => state.vars.params);
  const selectedParams = params.filter(param => param.selected)
    .map(param => param.raw)

  const url = new URL(window.location.origin)
  url.pathname = `${siteBase}dash`
  url.searchParams.set('params', selectedParams.join(','))

  return url
}

const useDashboardData = (dataOptions: DashboardOptions) => {
  const { data, error } = usePollingData(dataOptions)
  if (error) return { utc_time: [] } as DecadesDataResponse
  return data
}

// useDimensions.js

import { useMemo, useSyncExternalStore } from "react"

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback)
  return () => {
    window.removeEventListener("resize", callback)
  }
}

function useDimensions(ref: React.RefObject<HTMLElement>) {
  const dimensions = useSyncExternalStore(
    subscribe,
    () => JSON.stringify({
      width: ref.current?.offsetWidth ?? 0, // 0 is default width
      height: ref.current?.offsetHeight ?? 0, // 0 is default height
    })
  )
  return useMemo(() => JSON.parse(dimensions), [dimensions])
}

export { useDimensions }


export { useDashboardUrl, useDashboardData }