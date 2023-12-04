/**
 * This module provides components for configuring the advanced view. It goes
 * about this all backwards, by displaying the configured view recursively
 * wuth a bunch of dumb components, and then using the ref to get the data
 * back out from the DOM. This works, but it's not very elegant and should
 * be improved in the future.
 */

import React, { forwardRef } from 'react';
import { useImperativeHandle, useState, useRef } from 'react';
import { useSelector, useDispatch } from '../redux/store';
import { setAdvancedConfig } from '../redux/viewSlice';
import { getAxesArray } from '../plot/plotUtils';
import { Tag, BooleanTag } from '../components/tags';
import { Input, FieldInput, GroupedField } from '../components/forms';
import { Button } from '../components/buttons';
import { useDarkMode } from '../hooks';
import { AdvancedConfig } from '../redux/viewSlice';
import { GaugePanelProps } from '../gauge/gauge.types';

// A Generic interface for the config handle
interface ConfigHandle<T> {
    getData: () => T
}

// The data types for the various config areas...
//...for data returned from the plot config area
type ConfigPlotData = {
    params: string[],
    axes: string[],
    timeframe: string,
    plotStyle: string,
    scrolling: boolean,
    header: boolean,
    ordvar: string,
    swapxy: boolean,
    server?: string
}

//...for data returned from the view config area
type ConfigViewData = {
    rows: number,
    cols: number,
    rowPc: number[],
    colPc: number[],
    valid: boolean
}

//...for data returned from the dashboard config area
type ConfigDashboardData = {
    params: string[],
    limits: string[]
}

/**
 * Provides a form for adding a view to the advanced view. It's a
 * forwardRef which uses an imperative handle to get the data back out
 * 
 * @param {*} props - the react props
 * @param {*} ref - the react ref
 * 
 * @component
 * 
 */
const ConfigViewArea = React.forwardRef<ConfigHandle<ConfigViewData>, {}>((_props, ref) => {

    const [rows, setRows] = useState("")
    const [cols, setCols] = useState("")
    const [rowPc, setRowPc] = useState("")
    const [colPc, setColPc] = useState("")

    // Return the data to the parent, with an indication of whether the data
    // are valid
    useImperativeHandle(ref, () => {
        return {
            getData: () => {
                return {
                    rows: parseInt(rows),
                    cols: parseInt(cols),
                    rowPc: rowPc.split(",").map(parseFloat),
                    colPc: colPc.split(",").map(parseFloat),
                    valid: validate()
                }
            }
        }
    }, [rows, cols, rowPc, colPc])

    // Validate the form data
    const validate = () => {
        if (rowPc == "") {
            let _rows = parseFloat(rows)
            setRowPc(new Array(_rows).fill((100 / _rows).toString()).join(","))
        }

        if (colPc == "") {
            let _cols = parseFloat(cols)
            setColPc(new Array(_cols).fill((100 / _cols).toString()).join(","))
        }

        if (rows === "" || cols === "") {
            return false
        }
        if (rowPc.split(",").map(x => parseFloat(x)).reduce((a, b) => a + b) !== 100) {
            return false
        }
        if (rowPc.split(",").length !== parseFloat(rows)) {
            return false
        }
        if (colPc.split(",").map(x => parseFloat(x)).reduce((a, b) => a + b) !== 100) {
            return false
        }
        if (colPc.split(",").length !== parseFloat(cols)) {
            return false
        }
        return true
    }

    // Validate the numver of row and columns - these must be positive integers
    const valPosInt = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        let val
        val = parseFloat(e.target.value)
        if (val < 1) {
            val = 1
        }
        setter(val.toString())
    }

    // Validate the row and column percentages - these must be comma separated
    // numbers which add up to 100
    const setter = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        let val = e.target.value
        setter(val)
        // validate()
    }

    return (
        <>
            <GroupedField>
                <Input type="number" placeholder="Number of rows" value={rows} onChange={(e: React.ChangeEvent<HTMLInputElement>) => valPosInt(e, setRows)} />
                <Input type="number" placeholder="Number of columns" value={cols} onChange={(e: React.ChangeEvent<HTMLInputElement>) => valPosInt(e, setCols)} />
            </GroupedField>
            <FieldInput type="text" placeholder="Row percentages (comma sep.)" value={rowPc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e, setRowPc)} />
            <FieldInput type="text" placeholder="Column percentages (comma sep.)" value={colPc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e, setColPc)} />
        </>
    )
})

/**
 * Add a plot to the advanced view. It's a
 * forwardRef which uses an imperative handle to get the data back out.
 * The current plot configuration is used, and is simply displayed to
 * the user here.
 * 
 * @param {*} props - the react props
 * @param {*} ref - the react ref
 * 
 * @component
 * 
 */
const ConfigPlotArea = React.forwardRef<ConfigHandle<ConfigPlotData>, {}>((_props, ref) => {

    // Get the current plot configuration
    const options = useSelector(state => state.options)
    const paramOptions = useSelector(state => state.vars)

    // Get the axes array representation
    const axesStrings = getAxesArray(paramOptions)

    // Return the data to the parent
    useImperativeHandle(ref, () => {
        return {
            getData: () => {
                return {
                    params: paramOptions.params.filter(x => x.selected).map(x => x.raw),
                    axes: axesStrings,
                    // TODO: Implement custom timeframes? Is it worth it?
                    timeframe: options.timeframes.filter(x => x.selected)[0]?.value || "30min",
                    plotStyle: options.plotStyle.value,
                    scrolling: options.scrollingWindow,
                    header: options.dataHeader,
                    ordvar: options.ordinateAxis,
                    swapxy: options.swapOrientation,
                    server: options.server
                }
            }
        }
    }, [options, paramOptions])

    // Configure the timeframe string
    let timeframe
    try {
        timeframe = options.timeframes.filter(x => x.selected)[0].label
    } catch (e) {
        if (options.useCustomTimeframe) {
            timeframe = `Custom [NOT SUPPORTED]`
        }
    }

    // Configure the parameter string
    const paramList = paramOptions.params.filter(x => x.selected).map(x => {
        return <Tag text={x.raw} is="info" extraClasses={"mr-1"} />
    })

    return (
        <div className="mt-2">
            Add a plot to the dashboard. The plot currently configured is
            <ul className="mt-2">
                <li><strong>Timeframe</strong>: <Tag text={timeframe} is="info" /></li>
                <li><strong>Parameters</strong>:  {paramList}</li>
                <li><strong>Style</strong>: <Tag text={options.plotStyle.value} is="info" /></li>
                <li><strong>Ordinate var</strong>: <Tag text={options.ordinateAxis} is="info" /></li>
                <li><strong>Swap x & y axes?</strong>: <BooleanTag value={options.swapOrientation} /></li>
                <li><strong>Scrolling?</strong>: <BooleanTag value={options.scrollingWindow} /></li>
            </ul>
        </div>
    )
})

/**
 * Add a tephigram to the advanced view. We currenly just use the 
 * default tephigram options.
 * 
 * 
 * @component
 * 
*/
const ConfigTephiArea = () => {
    return (
        <div className="mt-2">
            Add a tephigram to the view. Currently this will only Use
            the default tephigram options.
        </div>
    )
}

/**
 * Add some timers to the advanced view. We currenly just use a blank timer page.
 */
const ConfigTimerArea = () => {
    return (
        <div className="mt-2">
            Add a timer to the view. Currently this will give a blank area
            to which you can add timers.
        </div>
    )
}

const ConfigGaugeArea = forwardRef((_props, ref) => {

    const gaugeOptions = useSelector(state => state.gauges)

    useImperativeHandle(ref, () => {
        return {
            getData: () => {
                return gaugeOptions
            }
        }
    })

    return (
        <div className="mt-2">
            Add one or more gauges to the view. See gauge configuration for more details.
        </div>
    )
})

/**
 * Add a dashboard to the advanced view. It's a forwardRef which uses an
 * imperative handle to get the data back out. The current dashboard
 * configuration is used, and is simply displayed to the user here.
 * 
 * @param {*} props - the react props
 * @param {*} ref - the react ref
 * 
 * @component
 */
const ConfigDashboardArea = React.forwardRef<ConfigHandle<ConfigDashboardData>, {}>((_props, ref) => {
    const paramOptions = useSelector(state => state.vars)

    const paramList = paramOptions.params.filter(x => x.selected).map(x => {
        return <Tag text={x.raw} is="info" extraClasses={"mr-1"} />
    })

    useImperativeHandle(ref, () => {
        return {
            getData: () => {
                return {
                    params: paramOptions.params.filter(x => x.selected).map(x => x.raw),
                    limits: []
                }
            }
        }
    }, [paramOptions])

    return (
        <div className="mt-2">
            <p>Add a dashboard to the to the view, with the currently selected set of
                parameters.</p>
            <p className="mt-2">
                Currently selected parameters are: {paramList}
            </p>
        </div>
    )
})

interface ConfigWidgetProps {
    visible: boolean,
    split: (rows: number, cols: number, rowPc: number[], colPc: number[]) => void,
    hide: () => void,
    top: boolean,
    setData: (data: any) => void
}
/**
 * Display the configuration widget. 
 * 
 * @param {*} props - the react props
 * @param {boolean} props.visible - whether the widget is visible
 * @param {*} props.split - a callback to split the view
 * @param {*} props.hide - a callback to hide the widget
 * @param {*} props.setData - a callback to set the data for the view
 * @param {boolean} props.top - whether the widget is the ancestor view
 * 
 * @component
 * 
 */
const ConfigWidget = (props: ConfigWidgetProps) => {

    const modalClass = props.visible ? "modal is-active" : "modal"
    const [widget, setWidget] = useState("VIEW")
    const viewRef = useRef<ConfigHandle<ConfigViewData>>(null)
    const plotRef = useRef<ConfigHandle<ConfigPlotData>>(null)
    const dashRef = useRef<ConfigHandle<ConfigDashboardData>>(null)
    const gaugeRef = useRef<ConfigHandle<GaugePanelProps>>(null)

    let wjsx

    switch (widget) {
        case "VIEW":
            wjsx = <ConfigViewArea ref={viewRef} />
            break
        case "PLOT":
            wjsx = <ConfigPlotArea ref={plotRef} />
            break
        case "TEPHI":
            wjsx = <ConfigTephiArea />
            break
        case "DASHBOARD":
            wjsx = <ConfigDashboardArea ref={dashRef} />
            break
        case "TIMERS":
            wjsx = <ConfigTimerArea />
            break
        case "GAUGE":
            wjsx = <ConfigGaugeArea ref={gaugeRef}/>
            break
        default:
            wjsx = null
    }

    /**
     * Get the class for the modal 
     */
    const getClass = (w: string): string => {
        return widget === w ? "is-active" : ""
    }

    /**
     * Save the configuration
     */
    const saveAction = () => {
        let data, handle
        switch (widget) {
            case "VIEW":
                // We're splitting the view
                if ((handle = viewRef.current) == null) {
                    throw new Error("View handle not found")
                }
                data = handle.getData()
                if (!data.valid) {
                    console.error("Invalid view configuration")
                    return
                }
                props.hide()
                props.split(data.rows, data.cols, data.rowPc, data.colPc)
                break
            case "PLOT":
                // We're adding a plot
                if ((handle = plotRef.current) == null) {
                    throw new Error("Plot handle not found")
                }
                props.setData({
                    type: "plot",
                    ...handle.getData()
                })
                props.hide()
                break
            case "TEPHI":
                // We're adding a tephigram
                props.setData({
                    type: "tephi"
                })
                props.hide()
                break
            case "TIMERS":
                // We're adding a timer
                props.setData({
                    type: "timers"
                })
                props.hide()
                break
            case "GAUGE":
                // We're adding a gauge
                if((handle = gaugeRef.current) == null) {
                    throw new Error("Gauge handle not found")
                }
                props.setData({
                    type: "gauge",
                    ...handle.getData()
                })
                props.hide()
                break
            case "DASHBOARD":
                // We're adding a dashboard
                if ((handle = dashRef.current) == null) {
                    throw new Error("Dashboard handle not found")
                }
                props.setData({
                    type: "dashboard",
                    ...handle.getData()
                })
                props.hide()
                break
        }
    }

    /**
     * Get the other tabs. If we're the top view, we don't show the
     * plot, tephigram or dashboard tabs, as the root view can't
     * contain those, and must be a view.
     * 
     * @returns the other tabs if we're not the top view
     */
    const otherTabs = () => {
        if (props.top) return null

        return (
            <>
                <li className={getClass("PLOT")}><a onClick={() => setWidget("PLOT")}>Plot</a></li>
                <li className={getClass("TEPHI")}><a onClick={() => setWidget("TEPHI")}>Tephi</a></li>
                <li className={getClass("DASHBOARD")}><a onClick={() => setWidget("DASHBOARD")}>Dashboard</a></li>
                <li className={getClass("TIMERS")}><a onClick={() => setWidget("TIMERS")}>Timers</a></li>
                <li className={getClass("GAUGE")}><a onClick={() => setWidget("GAUGE")}>Gauges</a></li>
            </>
        )
    }

    // Build the JSX
    return (
        <div className={modalClass}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Configure view area</p>
                    <button className="delete" onClick={props.hide} aria-label="close"></button>
                </header>
                <section className="modal-card-body">
                    <div className="tabs is-centered">
                        <ul>
                            <li className={getClass("VIEW")}><a onClick={() => setWidget("VIEW")}>View</a></li>
                            {otherTabs()}
                        </ul>
                    </div>
                    {wjsx}
                </section>
                <footer className="modal-card-foot">

                    <Button.Success onClick={saveAction}>Add</Button.Success>
                    <Button onClick={props.hide}>Cancel</Button>

                </footer>
            </div>
        </div>
    )
}


const emptyConfig = (): AdvancedConfig => {
    return {
        type: "view",
        rows: 1,
        columns: 1,
        rowPercent: [100],
        columnPercent: [100],
        elements: []
    }
}

interface AdvancedViewConfigProps {
    config: AdvancedConfig,
    setConfig: (cfg: AdvancedConfig) => void,
    data?: any,
    top?: boolean
}
const _AdvancedViewConfig = (props: AdvancedViewConfigProps) => {

    const [showWidget, setShowWidget] = useState(false)
    const [darkMode, _setDarkMode] = useDarkMode()

    const setConfig = (cfg: AdvancedConfig, i: number) => {
        let newConfig = { ...props.config }
        newConfig.elements[i] = cfg
        props.setConfig(newConfig)
    }

    const split = (rows: number, columns: number, rowPc: number[], colPc: number[]) => {
        const title = {
            title: props.top ? props?.config?.title : undefined
        }
        props.setConfig({
            type: "view",
            rows: rows,
            columns: columns,
            rowPercent: rowPc,
            columnPercent: colPc,
            elements: new Array(rows * columns).fill(emptyConfig()),
            ...title
        })

    }

    const borderStyle = props.top 
        ? darkMode
            ? "3px solid lightgray"  
            : "3px solid black" 
        : "1px solid gray"

    const style: React.CSSProperties = {
        display: "grid",
        gridTemplateRows: props.config?.rowPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        gridTemplateColumns: props.config?.columnPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        width: props.top ? "100%" : "",
        height: props.top ? 2 * innerHeight / 3 : "",
        outline: borderStyle,
        borderRadius: props.top ? "5px" : undefined,
    }

    const widget = <ConfigWidget
        visible={showWidget}
        split={split}
        hide={() => setShowWidget(false)}
        top={props.top || false}
        setData={props.setConfig} />

    const resetToView = () => {
        props.setConfig(emptyConfig())
    }

    const elements = props.config.elements

    const dmFilter = darkMode ? "invert(63%) sepia(2%) saturate(13%) hue-rotate(331deg) brightness(86%) contrast(79%)" : ""
    const ImageElement = (props: { src: string }) => {
        return (
            <div style={{ outline: borderStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img onClick={resetToView} src={props.src} alt="plot" style={{ height: "64px", width: "64px", filter: dmFilter }} />
            </div>
        )
    }

    if (!elements?.length) {

        switch (props.config.type) {
            case ("view"):
                return (
                    <>
                        {widget}
                        <div style={style}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Button.Info onClick={() => {
                                    setShowWidget(true)
                                }} >Configure</Button.Info>
                            </div>
                        </div>
                    </>
                )
            case "plot":
                return <ImageElement src="dashicons/chart.svg" />
            case "tephi":
                return <ImageElement src="dashicons/tephi.svg" />
            case "dashboard":
                return <ImageElement src="dashicons/dashboard.svg" />
            case "alarms":
                return <ImageElement src="dashicons/alarm.svg" />
            case "timers":
                return <ImageElement src="dashicons/timer.svg" />
            case "url":
                return <ImageElement src="dashicons/link.svg" />
            case "gauge":
                return <ImageElement src="dashicons/gauge.svg" />

        }
    }

    return (
        <div style={style}>
            {elements.map((x: AdvancedConfig, i: number) => {
                return <_AdvancedViewConfig key={i} config={x} setConfig={(cfg: AdvancedConfig) => setConfig(cfg, i)} />
            })}
        </div>
    )

}


const AdvancedViewConfig = () => {
    const currentConfig = useSelector(state => state.view.advancedConfig)
    const dispatch = useDispatch()
    // const [viewTitle, setViewTitle] = useState("")

    /**
     * Function to make the config mutable, so we can edit it - the state
     * returned by useSelector is immutable
     * 
     * @param {AdvancedConfig} cfg - the config to make mutable
     */
    const mutable = (cfg: AdvancedConfig) => {
        let newConfig = { ...cfg }
        newConfig.elements = newConfig.elements.map(x => {
            if (x.type === "view") {
                return mutable(x)
            }
            return x
        })
        return newConfig
    }

    // Create a mutable copy of the config
    const config = mutable(currentConfig)

    // Launch the view in a new tab
    const launch = () => {
        localStorage.setItem("viewConfig", JSON.stringify(currentConfig))
        window.open("jsonview", "_blank")
    }

    return (
        <>
            <FieldInput placeholder="View Title" value={config.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { dispatch(setAdvancedConfig({...config, title:e.target.value})) }} />


            <_AdvancedViewConfig config={config} setConfig={(c: AdvancedConfig) => dispatch(setAdvancedConfig(c))} top={true} />
            <div className="is-flex is-justify-content-space-between mt-2">
                <div>
                    {/* <Button.Success onClick={() => { }}>Save</Button.Success> */}
                    <Button.Danger onClick={()=>{
                        dispatch(setAdvancedConfig({...emptyConfig(), title: ""}))
                    }}>Reset</Button.Danger>
                </div>
                <div>
                    <Button.Info onClick={launch}>Launch</Button.Info>
                </div>
            </div>
        </>
    )

}

export { AdvancedViewConfig }