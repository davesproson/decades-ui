import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom'
import { useServers, useDarkMode } from './hooks';
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
const Timers = lazy(() => import('./timers/timer'))
const TimerConfig = lazy(() => import('./timers/config'))
const GaugePanelDispatcher = lazy(() => import('./gauge/gauge'))
const GaugeConfigurator = lazy(() => import('./gauge/gaugeConfig'))
const HeadingIndicator = lazy(() => import('./heading/heading'))
const RollIndicator = lazy(() => import('./roll/roll'))
const PitchIndicator = lazy(() => import('./pitch/pitch'))

import { VistaErrorBoundary } from './components/error';
import { useEffect } from 'react';

interface SuspenseLoaderProps {
  text?: string,
  children: React.ReactNode
}
const SuspenseLoader = (props: SuspenseLoaderProps) => {

  return (
    <Suspense fallback={<Loader text={props.text || "Loading..."} />}>
      {props.children}
    </Suspense>
  )
}

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
  const [_darkMode, _setDarkMode] = useDarkMode()

  useEffect(() => {
    const paramSet = searchParams.get('paramset')
    if (paramSet) {
      dispatch(setParamSet(paramSet))
    }
  }, [searchParams, dispatch])

  return (
    <VistaErrorBoundary>
    <SuspenseLoader text="Initializing..." >
      <Routes>
        <Route path="/" element={<><Navbar /><Tutorial /></>} >
          <Route path="/" element={<SuspenseLoader><ParameterTable /></SuspenseLoader>} />
          <Route path="/options" element={<SuspenseLoader><Options /></SuspenseLoader>} />
          <Route path="/timeframe" element={<SuspenseLoader><TimeframeSelector /></SuspenseLoader>} />
          <Route path="/config-view" element={<SuspenseLoader><ViewConfig /></SuspenseLoader>} />
          <Route path="/view-library" element={<SuspenseLoader><ViewLibrary /></SuspenseLoader>} />
          <Route path="/alarm-config" element={<SuspenseLoader><AlarmList /></SuspenseLoader>} />
          <Route path="/timer-config" element={<SuspenseLoader><TimerConfig /></SuspenseLoader>} />
          <Route path="/gauge-config" element={<SuspenseLoader><GaugeConfigurator /></SuspenseLoader>} />
        </Route>
        <Route path="/view" element={<SuspenseLoader><View /></SuspenseLoader>} />
        <Route path="/jsonview" element={<SuspenseLoader><JsonView /></SuspenseLoader>} />
        {/* @ts-ignore TODO - why the whining here? */}
        <Route path="/plot" element={<SuspenseLoader><PlotDispatcher /></SuspenseLoader>} />
        <Route path="/dashboard" element={<SuspenseLoader><DashboardDispatcher /></SuspenseLoader>} />
        <Route path="/tephigram" element={<SuspenseLoader><Tephigram /></SuspenseLoader>} />
        <Route path="/alarms" element={<SuspenseLoader><AlarmList /></SuspenseLoader>} />
        <Route path="/timers" element={<SuspenseLoader><Timers /></SuspenseLoader>} />
        <Route path="/gauge" element={<SuspenseLoader><GaugePanelDispatcher /></SuspenseLoader>} />
        <Route path="/heading" element={<SuspenseLoader><HeadingIndicator standalone={true}/></SuspenseLoader>} />
        <Route path="/roll" element={<SuspenseLoader><RollIndicator standalone={true}/></SuspenseLoader>} />
        <Route path="/pitch" element={<SuspenseLoader><PitchIndicator standalone={true}/></SuspenseLoader>} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </SuspenseLoader>
    </VistaErrorBoundary>
  )
}

export default DecadesVista
