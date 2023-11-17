import 'bulma/css/bulma.min.css';

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom'
import { useServers } from './hooks';
import { Loader } from './components/loader';
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setParamSet } from './redux/parametersSlice';

const Navbar = lazy(() => import('./navbar/navbar'))
const TimeframeSelector = lazy(() => import('./timeframe/timeframe'))
const ViewConfig = lazy(() => import('./views/viewConfig'))
const Tephigram = lazy(() => import('./tephigram/tephigram'))
const DashboardDispatcher = lazy(() => import('./dashboard/dashboard'))
const PlotDispatcher = lazy(() => import('./plot/plot'))
const Options = lazy(() => import('./options/options'))
const ParameterTable = lazy(() => import('./parameters/params'))
const View = lazy(() => import('./views/view'))
const ViewLibrary = lazy(() => import('./views/viewLibrary'))
const Tutorial = lazy(() => import('./tutorial/tutorial'))
const AlarmList = lazy(() => import('./alarms/alarm'))
const JsonView = lazy(() => import('./views/jsonView'))

import { VistaErrorBoundary } from './components/error';
import { useEffect } from 'react';

/**
 * The main app component. This is the entry point for the application, which
 * provides the routing for the application.
 * 
 * @component
 * @example
 * return (
 *  <App />
 * )
 */
const DecadesVista = () => {

  useServers()
  const [searchParams, _] = useSearchParams()
  const dispatch = useDispatch()

  useEffect(() => {
    const paramSet = searchParams.get('paramset')
    if (paramSet) {
      dispatch(setParamSet(paramSet))
    }
  }, [searchParams, dispatch])

  return (
    <VistaErrorBoundary >
    <Suspense fallback={<Loader text="Initializing..."/>}>
      <Routes>
        <Route path="/" element={<><Navbar /><Tutorial /></>} >
          <Route path="/" element={<Suspense><ParameterTable /></Suspense>} />
          <Route path="/options" element={<Suspense><Options /></Suspense>} />
          <Route path="/timeframe" element={<Suspense><TimeframeSelector /></Suspense>} />
          <Route path="/config-view" element={<Suspense><ViewConfig /></Suspense>} />
          <Route path="/view-library" element={<Suspense><ViewLibrary /></Suspense>} />
          <Route path="/alarm-config" element={<Suspense><AlarmList openExternal={true}/></Suspense>} />
        </Route>
        <Route path="/view" element={<Suspense><View /></Suspense>} />
        <Route path="/jsonview" element={<Suspense><JsonView /></Suspense>} />
        <Route path="/plot" element={<Suspense><PlotDispatcher /></Suspense>} />
        <Route path="/dashboard" element={<Suspense><DashboardDispatcher useURL={true}/></Suspense>} />
        <Route path="/tephigram" element={<Suspense><Tephigram /></Suspense>} />
        <Route path="/alarms" element={<Suspense><AlarmList /></Suspense>} />
        

        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </Suspense>
    </VistaErrorBoundary>
  )
}

export default DecadesVista
