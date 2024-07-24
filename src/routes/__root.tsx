import { Error404, VistaError } from '@/components/errors'
import Loader from '@/components/loader'
import { OptionsSheet } from '@/options-sheet/options'
import { useQuickLookTimeframe } from '@/quicklook/hooks'
import { setQuickLookMode } from '@/redux/configSlice'
import { setQcJob } from '@/redux/quicklookSlice'
import { useDispatch } from '@/redux/store'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => {
    const dispatch = useDispatch()
    const [initDone, setInitDone] = useState(false)

    useEffect(() => {
      if (initDone) return
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.has('job')) {
        const job = searchParams.get('job')
        if(!job || job==='null') {
          setInitDone(true)
          return
        }
        dispatch(setQcJob((job && parseInt(job)) || null))
        dispatch(setQuickLookMode(true))
      }
      setInitDone(true)
    }, [dispatch, setInitDone, setQcJob, setQuickLookMode])

    useQuickLookTimeframe()

    if (!initDone) return <Loader />

    return (
      <>
        <OptionsSheet />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </>
    )
  },
  pendingComponent: () => <Loader />,
  errorComponent: ({ error }) => <VistaError error={error} message="An error occured" />,
  notFoundComponent: () => <Error404 />,
})