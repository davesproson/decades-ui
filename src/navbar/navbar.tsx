import { useDispatch, useSelector } from "../redux/store"
import { useState, lazy } from "react"
import { setFilterText } from "../redux/filterSlice"
import { Link, useLocation } from "react-router-dom"
import { resetParams, toggleParamSelected, unselectAllParams } from "../redux/parametersSlice"
import { setOrdinateAxis, setTimeframe } from "../redux/optionsSlice"
import { usePlotInternalOptions, usePlotUrl } from "../plot/hooks"
import { useDashboardUrl } from "../dashboard/hooks"
import { useTephiAvailable, useTephiUrl } from "../tephigram/hooks"
import { Outlet } from "react-router-dom"
import { loadSavedView, setViewConfigTab } from "../redux/viewSlice"
import { useNavigate } from "react-router-dom"
import { enableQuicklook, enableChat, enableMap } from "../settings"
import { Button } from "../components/buttons"
import PropTypes from "prop-types"
import { ConfigPanel } from "../configPanel/config"
import { SuspenseLoader } from "../components/loader"
import { LiveDataOnly, QuicklookOnly } from "../quicklook"
import { BleedingEdge } from "../components/bleeding"
import { addTab } from "../redux/tabsSlice"
import { useGeoCoords, usePresets } from "../hooks"
import { QuicklookJob, setFlightNumber, setQcJob } from "../redux/quicklookSlice"

const VistaModeSelector = lazy(() => import('../modeSelect'))
const QuicklookSelector = lazy(() => import('../quicklook'))

const externalLinkStyle = {display:"flex", alignItems: "center", maxWidth: "30px", marginRight: "5px"}
const ExternalLinkIcon = () => {
 return (
        <svg className="dm-filter is-pulled-right" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g id="Interface / External_Link">
                <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"  fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
        </svg>
    )
}

const FlightSelector = () => {
    const [visible, setVisible] = useState(false)
    const flight = useSelector(state => state.quicklook.flightNumber)
    const qcJobs = useSelector(state => state.quicklook.qcJobs)
    const dispatch = useDispatch()

    const filteredQcJobs = qcJobs?.filter(x => x.flightNumber !== flight) || []

    const visibleClass = visible ? "is-active" : ""

    const dispatchQcJob = (qcJob: QuicklookJob) => {
        console.log(qcJob)
        dispatch(resetParams())
        dispatch(setQcJob(qcJob.jobID))
        dispatch(setFlightNumber(qcJob.flightNumber))
    }

    return (
        <div className={`navbar-item has-dropdown ${visibleClass}`}>
            <a id="views-navbar-item" className="navbar-link" onClick={()=>setVisible(x=>!x)}>
                {flight}
            </a>
            <div className="navbar-dropdown" onClick={() => setVisible(false)} onMouseLeave={() => setVisible(false)}>
            {
                filteredQcJobs.map((x, i) => {
                    return (
                        <a className="navbar-item" key={i} onClick={()=>dispatchQcJob(x)}>
                            {x.flightNumber} ({x.flightProject})
                        </a>
                    )
                })
            }
            </div>
        </div>
    )
}

/**
 * Provides a navbar dropdown menu which allows the user to select the timeframe
 * to plot over, and navigate to the custom timeframe page.
 * 
 * Uses state from the optionsSlice to determine which timeframes are available 
 * and which is selected.
 * 
 * Dispatches the setTimeframe action.
 * 
 * Local state is used to determine whether the dropdown menu is visible.
 * 
 * @component
 * @example
 * return (
 *  <NavTimeFrameSelector />
 * )
 * 
 */
const NavTimeFrameSelector = () => {

    const [visible, setVisible] = useState(false)
    const dispatch = useDispatch()

    const timeframes = useSelector(state => state.options.timeframes)
    const selectedTimeframes = timeframes.filter(x => x.selected)
    const customActiveClass = selectedTimeframes.length === 0 ? "has-text-success is-underlined" : ""

    const toggleVisible = () => {
        setVisible(!visible)
    }

    const timeframeElements = timeframes.map(x => {
        const active = x.selected ? "has-text-success is-underlined" : ""

        const onSetTimeframe = (e: string) => {
            dispatch(setTimeframe({ value: e }))
        }

        return (
            <a className="navbar-item" key={x.value} onClick={() => { onSetTimeframe(x.value); toggleVisible() }}>
                <span className={active}>{x.label}</span>
            </a>
        )
    })

    const visibleClass = visible ? "is-active" : ""

    return (
        <div id="timeframe-navbar" className={`navbar-item has-dropdown ${visibleClass}`} onMouseLeave={() => setVisible(false)}>
            <a id="timeframe-navbar-item" className="navbar-link" onClick={toggleVisible}>
                Timeframe
            </a>

            <div className="navbar-dropdown" >
                <LiveDataOnly >
                    {timeframeElements}
                    <hr className="navbar-divider" />
                </LiveDataOnly>
                <div onClick={toggleVisible}>
                    <Link to="/timeframe" className="navbar-item" >
                        <span className={customActiveClass}>Custom...</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

/**
 * Provides a navbar dropdown menu which allows the user to select a preset group of parameters
 * 
 * Dispatches the toggleParamSelected and unselectAllParams actions.
 * 
 * Local state is used to determine whether the dropdown menu is visible.
 * 
 * @component
 * @example
 * return (
 *  <PresetSelector />
 * )
 * 
 */
const PresetSelector = () => {
    const dispatch = useDispatch()
    const presets = usePresets()
    const [visible, setVisible] = useState(false)
    const toggleVisible = () => {
        setVisible(!visible)
    }

    const setPreset = (presets: Array<string | number>) => {
        dispatch(unselectAllParams())
        for (let p of presets) {
            dispatch(toggleParamSelected({ name: p.toString() }))
        }
        setVisible(false)
    }

    const visibleClass = visible ? "is-active" : ""
    const presetOptions = Object.entries(presets).map(x => {

        return (
            <a className="navbar-item" key={x[0]} onClick={() => setPreset(x[1])}>
                <span>{x[0]}</span>
            </a>
        )
    })

    return (
        <div className={`navbar-item has-dropdown ${visibleClass}`} onMouseLeave={() => setVisible(false)}>
            <a className="navbar-link" onClick={toggleVisible}>
                Presets
            </a>
            <div className="navbar-dropdown">
                {presetOptions}
            </div>
        </div>
    )
}

/**
 * Provides a navbar dropdown menu which allows the user to select a saved view
 * or navigate to the view config page.
 * 
 * Uses state from the viewSlice to determine which views are available.
 * 
 * Dispatches the loadSavedView action.
 * 
 * @component
 * @example
 * return (
 *  <ViewsSelector />
 * )
 */

const ViewsSelector = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const savedViews = useSelector(state => state.view.savedViews)
    const [visible, setVisible] = useState(false)

    const visibleClass = visible ? "is-active" : ""

    // I've named a function goto. I'm sorry.
    const goto = (id: string) => {
        dispatch(loadSavedView({ id: id }))
        const viewVersion = savedViews.find(x => x.id === id).version

        switch (viewVersion) {
            case 2:
                dispatch(setViewConfigTab("BASIC"))
                break
            case 3:
                dispatch(setViewConfigTab("ADVANCED"))
        }

        navigate("/config-view")
    }

    const toggleVisible = () => {
        setVisible(!visible)
    }

    const viewElements = savedViews.map((x, i) => {
        return (
            <a className="navbar-item" key={i} onClick={() => goto(x.id)}>
                <span>{x.name}</span>
            </a>
        )
    })


    return (
        <div id="views-navbar" className={`navbar-item has-dropdown ${visibleClass}`}>
            <a id="views-navbar-item" className="navbar-link" onClick={toggleVisible}>
                Views
            </a>
            <div className="navbar-dropdown" onClick={() => setVisible(false)} onMouseLeave={() => setVisible(false)}>
                <Link to="/config-view" className="navbar-item">
                    Config...
                </Link>
                <Link to="/view-library" className="navbar-item">
                    Library...
                </Link>
                <hr className="navbar-divider" />
                {viewElements}
            </div>
        </div>
    )
}

/**
 * Provides a navbar dropdown menu which allows the user to select a saved view
 * or navigate to the view config page.
 * 
 * Uses state from the viewSlice to determine which views are available.
 * 
 * Dispatches the loadSavedView action.
 * 
 * @component
 * @example
 * return (
 *  <ViewsSelector />
 * )
 */

const MoreSelector = () => {
    const [visible, setVisible] = useState(false)

    const visibleClass = visible ? "is-active" : ""

    const toggleVisible = () => {
        setVisible(!visible)
    }

    return (
        <div id="views-navbar" className={`navbar-item has-dropdown ${visibleClass}`}>
            <a id="views-navbar-item" className="navbar-link" onClick={toggleVisible}>
                More
            </a>
            <div className="navbar-dropdown" onClick={() => setVisible(false)} onMouseLeave={() => setVisible(false)}>
                <BleedingEdge show={enableMap}>
                    <div className="is-flex">
                        <Link to="/map" className="navbar-item is-flex-grow-1">
                            Map...
                        </Link>
                        <a href="map-ext" target="_blank" style={externalLinkStyle}>
                            <ExternalLinkIcon />
                        </a>
                    </div>
                </BleedingEdge>
                <div className="is-flex">
                    <Link to="/fltsum" className="navbar-item is-flex-grow-1">
                        Flight summary...
                    </Link>
                    <a href="fltsum-ext" target="_blank" style={externalLinkStyle}>
                        <ExternalLinkIcon />
                    </a>
                </div>
                <BleedingEdge show={enableChat}>
                    <Link to="/chat" className="navbar-item">
                        Chat...
                    </Link>
                    <hr className="navbar-divider" />
                </BleedingEdge>
                <Link to="/alarm-config" className="navbar-item">
                    Alarms...
                </Link>
                <Link to="/timer-config" className="navbar-item">
                    Timers...
                </Link>
                <Link to="/gauge-config" className="navbar-item">
                    Gauges...
                </Link>
            </div>
        </div>
    )
}

interface PlotButtonMenuProps {
    visible: boolean,
    hide: () => void
}
/**
 * Provides a navbar dropdown menu which allows the user to plot against
 * latitude, longitude, or height without going through the faff of
 * configuring the ordinate variable.
 * 
 * Uses the usePlotUrl hook to generate the urls.
 * 
 * @param {Object} props
 * @param {boolean} props.visible - Whether the menu should be visible
 * @param {function} props.hide - A function to hide the menu
 * 
 * @component
 * @example
 * return (
 * <PlotButtonMenu visible={true} hide={()=>{}} />
 * )
 */
const PlotButtonMenu = (props: PlotButtonMenuProps) => {
    const geoCoords = useGeoCoords()

    const style: React.CSSProperties = {
        boxShadow: "0 0 8px #777",
        display: props.visible ? "block" : "none",
        left: -100,
        position: "absolute",
        top: "100%",
        zIndex: "1000",
        backgroundColor: "#fff",
    }

    const latUrl = usePlotUrl({ "ordvar": geoCoords.latitude, swapxy: true })
    const lonUrl = usePlotUrl({ "ordvar": geoCoords.longitude })
    const heightUrl = usePlotUrl({ "ordvar": geoCoords.altitude, swapxy: true })
    const latUrlStr = latUrl ? latUrl.toString() : "#"
    const lonUrlStr = lonUrl ? lonUrl.toString() : "#"
    const heightUrlStr = heightUrl ? heightUrl.toString() : "#"

    return (
        <div style={style} onMouseLeave={props.hide}>
            <a className="navbar-item" href={latUrlStr} target="_blank" rel="noopener noreferrer">
                <span>vs. Latitude</span>
            </a>
            <a className="navbar-item" href={lonUrlStr} target="_blank" rel="noopener noreferrer">
                <span>vs. Longitude</span>
            </a>
            <a className="navbar-item" href={heightUrlStr} target="_blank" rel="noopener noreferrer">
                <span>vs. Height</span>
            </a>
        </div>
    )
}
PlotButtonMenu.propTypes = {
    visible: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
}

/**
 * Provides a navbar button which allows the user to navigate to the plot page, using
 * a url build from the current parameter selection and options.
 * 
 * Uses state from the varsSlice to determine if any parameters are selected.
 * 
 * @component
 * @example
 * return (
 * <PlotButton />
 * )
 */
const PlotButton = () => {
    const params = useSelector(state => state.vars.params)
    const tabbedPlots = useSelector(state => state.config.tabbedPlots)
    const dispatch = useDispatch()

    const disable = params.filter(x => x.selected).length === 0
    const [menuVisible, setMenuVisible] = useState(false)

    const toggleMenuVisible = () => {
        setMenuVisible(!menuVisible)
    }

    const plotUrl = usePlotUrl()
    const plotUrlStr = plotUrl ? plotUrl.toString() : "#"
    const plotOptions = usePlotInternalOptions()

    const leftStyle = {
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        marginRight: "0px",
        borderRight: "1px solid #dbdbdbaa"
    }

    const rightStyle = {
        borderTopLeftRadius: "0px",
        borderBottomLeftRadius: "0px",
        marginLeft: "0px",
        padding: "5px"
    }

    if (disable) {
        return (
            <>
                <Button.Primary style={leftStyle} disabled>Plot</Button.Primary>
                    <Button.Primary style={rightStyle} disabled>▾</Button.Primary>
            </>
        )
    }

    const plotButton = tabbedPlots
        ? (
            <Button.Primary style={leftStyle} onClick={()=>{
                dispatch(addTab({type: 'plot', name: 'New Plot', ...plotOptions}))
            }}>
                Plot
            </Button.Primary>
        )
        : (
            <Button.Primary anchor style={leftStyle} href={plotUrlStr} target="_blank" rel="noopener noreferrer">
                Plot
            </Button.Primary>
        )
        

    return (
        <>
            {plotButton}
            <Button.Primary style={rightStyle} onClick={toggleMenuVisible}>
                ▾
                <PlotButtonMenu visible={menuVisible} hide={() => setMenuVisible(false)} />
            </Button.Primary>
        </>
    )
}

/**
 * Provides a navbar button which allows the user to navigate to the tephigram page, assuming
 * that the tephigram is available, given by useTephiAvailable. The url is built from the current
 * parameter selection and options.
 * 
 * @component
 * @example
 * return (
 * <TephiButton />
 * )
 */
const TephiButton = () => {

    const available = useTephiAvailable()
    const url = useTephiUrl()

    if (!available) {
        return (
            <Button.Primary disabled>Tephigram</Button.Primary>
        )
    }

    return (
        <Button.Primary anchor href={url} target="_blank" rel="noopener noreferrer">
            Tephigram
        </Button.Primary>
    )
}

/**
 * Provides a navbar button which allows the user to navigate to the dashboard page, using
 * a url build from the current parameter selection and options.
 * 
 * Uses state from the varsSlice to determine if any parameters are selected.
 * 
 * @component
 * @example
 * return (
 * <DashButton />
 * )
 */
const DashButton = () => {
    const params = useSelector(state => state.vars.params)
    const disable = params.filter(x => x.selected).length === 0
    const dashUrl = useDashboardUrl()

    if (disable) {
        return (
            <Button.Primary disabled>Dashboard</Button.Primary>
        )
    }

    return (
        <Button.Primary anchor href={dashUrl} target="_blank" rel="noopener noreferrer">
            Dashboard
        </Button.Primary>
    )
}

/**
 * Provides a navbar button which allows the user to navigate to the options page, or back to the
 * home page, depending on the current page.
 * 
 * @component
 * @example
 * return (
 * <OptionsButton />
 * )
 */
const OptionsButton = () => {

    const location = useLocation()

    const to = location.pathname === "/" ? "/options" : "/"
    const text = location.pathname !== "/" ? "Home" : "Options"

    return (
        <Button.Dark outlined to={to}>
            {text}
        </Button.Dark>
    )
}

/**
 * Provides a navbar button which allows the user to clear the current parameter selection and
 * filter text.
 * 
 * Dispatches the unselectAllParams, setFilterText and setOrdinateAxis actions.
 * 
 * @component
 * @example
 * return (
 * <ClearButton />
 * )
 */
const ClearButton = () => {
    const dispatch = useDispatch()

    const clear = () => {
        dispatch(unselectAllParams())
        dispatch(setFilterText({ filterText: "" }))
        dispatch(setOrdinateAxis('utc_time'))
    }

    return (
        <Button.Info outlined onClick={clear}>
            Clear
        </Button.Info>
    )
}

interface NavbarMenuProps {
    active: boolean
}
/**
 * Provides a navbar menu which contains the search input, time frame selector, preset selector,
 * views selector, clear button, options button, plot button, tephigram button and dashboard button.
 * 
 * Uses state from the paramfilterSlice to determine the current filter text.
 * 
 * @component
 * @example
 * return (
 * <NavbarMenu />
 * )
 */
const NavbarMenu = (props: NavbarMenuProps) => {

    const navbarClass = props.active ? "navbar-menu is-active" : "navbar-menu"

    return (
        <div id="navbar" className={navbarClass}>
            <div className="navbar-start">
                <ConfigPanel />
                <QuicklookOnly>
                    <FlightSelector />
                </QuicklookOnly>
                <NavTimeFrameSelector />
                <PresetSelector />
                <LiveDataOnly>
                    <ViewsSelector />
                    <MoreSelector />
                </LiveDataOnly>
            </div>

            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        <ClearButton />
                        <OptionsButton />
                        <PlotButton />
                        <TephiButton />
                        <LiveDataOnly>
                            <DashButton />
                        </LiveDataOnly>
                    </div>
                </div>
            </div>
        </div>
    )
}
NavbarMenu.propTypes = {
    active: PropTypes.bool.isRequired
}

interface NavbarBurgerProps {
    active: boolean,
    toggle: () => void
}
/**
 * Provides a navbar burger which toggles the navbar menu in mobile view.
 *
 * @param {boolean} props.active - Whether the navbar is active or not.
 * @param {function} props.toggle - The function to toggle the navbar.
 *  
 * @component
 * @example
 * return (
 * const active = true
 * const toggle = () => {}
 * <NavbarBurger active={active} toggle={toggle} />
 * )
 */
const NavbarBurger = (props: NavbarBurgerProps) => {

    const burgerClass = props.active ? "navbar-burger is-active" : "navbar-burger"

    return (
        <div className="navbar-brand">
            <a role="button" className={burgerClass}
                aria-label="menu" aria-expanded="false"
                data-target="navbar" onClick={props.toggle}
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
    )
}
NavbarBurger.propTypes = {
    active: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired
}


/**
 * Provides the application navbar, including an outlet for the router.
 * 
 * @component
 * @example
 * return (
 * <Navbar />
 * )
 */
const Navbar = () => {
    const [active, setActive] = useState(false)
    const modeSelected = useSelector(state => state.config.modeSelected)
    const quicklookMode = useSelector(state => state.config.quickLookMode)
    const qcJob = useSelector(state => state.quicklook.qcJob)

    // This probably isn't the best place for this, but...
    if (enableQuicklook) {
        if (!modeSelected) return <SuspenseLoader><VistaModeSelector /></SuspenseLoader>
        if (!qcJob && quicklookMode) return <SuspenseLoader><QuicklookSelector /></SuspenseLoader>
    }

    const toggleActive = () => {
        setActive(!active)
    }

    return (
        <>
            <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
                <NavbarBurger active={active} toggle={toggleActive} />
                <NavbarMenu active={active} />
            </nav>
            <Outlet />
        </>
    )
}

export default Navbar
