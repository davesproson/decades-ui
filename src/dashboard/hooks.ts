import { useSelector } from '@store'
import { useEffect, useState } from 'react'
import { base as siteBase } from '@/settings'
import { getData } from '@/data/utils';
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
  const [data, setData] = useState<DecadesDataResponse>()

  useEffect(() => {
    getData(dataOptions).then(data => setData(data))
      .catch(() => setData({ 'utc_time': [] }))

    const interval = setInterval(() => {
      if (!(document.visibilityState === "visible")) return
      getData(dataOptions).then(data => setData(data))
        .catch(() => setData({ 'utc_time': [] }))
    }, 1000)
    return () => clearInterval(interval)
  }, [setData])

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