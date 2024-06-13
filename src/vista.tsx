import 'react-toastify/dist/ReactToastify.css';

import { lazy, useEffect, useState } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom'
import { useServers, useDarkMode, useQuickLookTimeframe } from './hooks';
import { SuspenseLoader } from './components/loader';

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
const Redash = lazy(() => import('./redash/redash'))
const ChatProvider = lazy(() => import('./chat/provider'))
const Chat = lazy(() => import('./chat/chat'))
const DecadesMap = lazy(() => import('./map/decadesMap'))

import { VistaErrorBoundary } from './components/error';
import { useDispatch, useSelector } from './redux/store';
import { setParamSet } from './redux/parametersSlice';
import { setQuickLookMode } from './redux/configSlice';
import { setQcJob } from './redux/quicklookSlice';
import { ToastContainer } from 'react-toastify';
import { When } from './components/flow';
import { removeTab, renameTab, selectTab } from './redux/tabsSlice';
import { Input } from './components/forms';

type TypeMapType = {
  [key: string]: React.FC<any>
}


const CloseButton = ({tabIndex}: {tabIndex: number}) => {
  const dispatch = useDispatch()

  const closeTab = () => {
    dispatch(removeTab(tabIndex))
  }

  if(tabIndex === 0) return null
  return (
    <div style={{position: "fixed", top: 70, left: 15, zIndex:9}}>
      <button className="delete ml-1" aria-label="delete" onClick={closeTab}></button>
    </div>
  )
}

const MainTabContent = () => {
  const tabs = useSelector(state => state.tabs.tabs)
  const selectedTab = useSelector(state => state.tabs.selectedTab)
  const typeMap: TypeMapType = {
    "plot": PlotDispatcher,
  }
  
  if(selectedTab === -1) return null
 
  const childStyle: React.CSSProperties = selectedTab === 0
    ? {}
    : {position: "absolute", inset: 0, top: 100}

  const Component = selectedTab === 0
  ? ParameterTable
  : typeMap[tabs[selectedTab - 1].type]

  return (<div style={childStyle}>
      <Component {...tabs[selectedTab-1]} />
    </div>
  )
}

const TabTitle = ({name, index}: {name: string, index: number}) => {
  const [editing, setEditing] = useState(false)
  const dispatch = useDispatch()

  if(!editing) return <span onDoubleClick={()=>setEditing(true)}>{name}</span>
  return (
    <Input
      style={{width: 130}}
      autoFocus
      value={name}
      onChange={(e)=>{dispatch(renameTab({index, name: e.target.value}))}}
      onBlur={()=>setEditing(false)}
      onFocus={(e)=>e.target.select()}
      onKeyDown={(e)=>{
        if(e.key === "Enter") setEditing(false)
      }}
    />
  
  )
}

const TabPanel = () => {
  const selectedTab = useSelector(state => state.tabs.selectedTab)
  const tabs = useSelector(state => state.tabs.tabs)
  const dispatch = useDispatch()

  return (
    <>
    <div className="tabs is-centered has-navbar-fixed-top has-background-white" style={{position:"fixed", width:"100%", zIndex: 1, top: "55px", height: "50px", padding:0}}>
      <ul>
      <li  className={selectedTab===0 ? "is-active" : ""}>
            <a onClick={() => dispatch(selectTab(0))}>
              <strong>Parameters</strong>
            </a>
      </li>
        {tabs.map((_c, i) => {
          return (<li key={i} className={i + 1 === selectedTab   ? "is-active" : ""}>
            <a onClick={() => {
                if(i+1 === selectedTab) return
                // This is a horrible hack to get the tab to refresh when it is clicked.
                // It's required because the plotly hooks are reacting correctly.
                // TODO: Do something better here.
                dispatch(selectTab(-1)); setTimeout(()=>dispatch(selectTab(i+1)), 0)}
              }>
              <TabTitle index={i} name={tabs[i].name}/>
            </a>
          </li>)
        })}
      </ul>
    </div>
    <CloseButton tabIndex={selectedTab}/>
    <MainTabContent />
    </>
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
  const dispatch = useDispatch()
  const [searchParams, _] = useSearchParams()
  const [_darkMode, _setDarkMode] = useDarkMode()
  const tabbedPlots = useSelector(state => state.config.tabbedPlots)
  
  useEffect(() => {
    const paramSet = searchParams.get('paramset')
    if (paramSet) {
      dispatch(setParamSet(paramSet))
    }
  }, [searchParams, dispatch])

  // If a job is passed in the URL, set the quicklook mode to true
  // and set the job in the quicklook slice
  useEffect(() => {
    if(searchParams.has('job')) {
      const job = searchParams.get('job')
      dispatch(setQcJob(job))
      dispatch(setQuickLookMode(true))
    }
  }, [searchParams])
  
  useQuickLookTimeframe()

  return (
    <VistaErrorBoundary>
      <ChatProvider>
      <ToastContainer />
    <SuspenseLoader text="Initializing..." >
      <Routes>
        <Route path="/" element={<><Navbar /><Tutorial /></>} >
          <Route path="/" element={
            <SuspenseLoader>
              <When condition={tabbedPlots}>
                <TabPanel />
              </When>
              <When condition={!tabbedPlots}>
                <ParameterTable />
              </When>
             </SuspenseLoader>
          } />
          <Route path="/options" element={<SuspenseLoader><Options /></SuspenseLoader>} />
          <Route path="/timeframe" element={<SuspenseLoader><TimeframeSelector /></SuspenseLoader>} />
          <Route path="/config-view" element={<SuspenseLoader><ViewConfig /></SuspenseLoader>} />
          <Route path="/view-library" element={<SuspenseLoader><ViewLibrary /></SuspenseLoader>} />
          <Route path="/alarm-config" element={<SuspenseLoader><AlarmList /></SuspenseLoader>} />
          <Route path="/timer-config" element={<SuspenseLoader><TimerConfig /></SuspenseLoader>} />
          <Route path="/gauge-config" element={<SuspenseLoader><GaugeConfigurator /></SuspenseLoader>} />
          <Route path="/chat" element={<SuspenseLoader><Chat /></SuspenseLoader>} />
          <Route path="/map" element={<SuspenseLoader>
            <div style={{position: "absolute", top: "50px", bottom:0, left:0, right:0}}>
              <DecadesMap />
            </div>
            </SuspenseLoader>} />
            
        </Route>
        <Route path="/view" element={<SuspenseLoader><View /></SuspenseLoader>} />
        <Route path="/jsonview" element={<SuspenseLoader><JsonView /></SuspenseLoader>} />
        {/* @ts-ignore TODO: TS complaining here as PlotDispatcher expects PlotURLOptions & PlotDispatcherProps */}
        <Route path="/plot" element={<SuspenseLoader><PlotDispatcher /></SuspenseLoader>} />
        <Route path="/dashboard" element={<SuspenseLoader><DashboardDispatcher /></SuspenseLoader>} />
        <Route path="/tephigram" element={<SuspenseLoader><Tephigram /></SuspenseLoader>} />
        <Route path="/alarms" element={<SuspenseLoader><AlarmList /></SuspenseLoader>} />
        <Route path="/timers" element={<SuspenseLoader><Timers /></SuspenseLoader>} />
        <Route path="/gauge" element={<SuspenseLoader><GaugePanelDispatcher /></SuspenseLoader>} />
        <Route path="/heading" element={<SuspenseLoader><HeadingIndicator standalone={true}/></SuspenseLoader>} />
        <Route path="/roll" element={<SuspenseLoader><RollIndicator standalone={true}/></SuspenseLoader>} />
        <Route path="/pitch" element={<SuspenseLoader><PitchIndicator standalone={true}/></SuspenseLoader>} />
        <Route path="/redash" element={<SuspenseLoader><Redash /></SuspenseLoader>} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </SuspenseLoader>
    </ChatProvider>
    </VistaErrorBoundary>
  )
}

export default DecadesVista
