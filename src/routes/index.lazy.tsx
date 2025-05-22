import { useEffect } from 'react'
import { useDispatch, useSelector } from '@store'
import { setParamSet } from '@/redux/parametersSlice'
import { setQcJob } from '@/redux/quicklookSlice'
import { setQuickLookMode } from '@/redux/configSlice'
import { useTheme } from '@/components/theme-provider'
import Navbar from '@/navbar'
import { ParameterPage } from '@/parameters/parameter-page'
import { createLazyFileRoute } from '@tanstack/react-router'
import { IndexSearch } from '.'
import Loader from '@/components/loader'
import { ModeSelector } from "@/modeSelect"
import QuicklookSelector from '@/quicklook/quicklook'
import { enableQuicklook } from '@/settings'

export const Route = createLazyFileRoute('/')({
  component: () => <Index />,
  pendingComponent: () => <Loader />,
})

function Index() {
  const { job, darkMode, paramset } = Route.useSearch<IndexSearch>()
  const modeSelected = useSelector((state) => state.config.modeSelected)
  const quickLookMode = useSelector((state) => state.config.quickLookMode)
  const qcJob = useSelector((state) => state.quicklook.qcJob)
  const dispatch = useDispatch()
  const { setTheme } = useTheme()

  useEffect(() => {
    if (paramset) {
      dispatch(setParamSet(paramset))
    }
  }, [dispatch, paramset])

  // If a job is passed in the URL, set the quicklook mode to true
  // and set the job in the quicklook slice
  useEffect(() => {
    if (job) {
      dispatch(setQcJob(job))
      dispatch(setQuickLookMode(true))
    }
  }, [job, dispatch, setQcJob, setQuickLookMode])

  useEffect(() => {
    if (darkMode)
      setTheme('dark')
  }, [darkMode, setTheme])

  if (!modeSelected && enableQuicklook) {
    return <ModeSelector />
  }

  if (modeSelected && quickLookMode && !qcJob && enableQuicklook) {
    return <QuicklookSelector />
  }

  return (
    <Navbar>
      <ParameterPage />
    </Navbar>
  )
}