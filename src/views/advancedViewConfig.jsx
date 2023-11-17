/**
 * This module provides components for configuring the advanced view. It goes
 * about this all backwards, by displaying the configured view recursively
 * wuth a bunch of dumb components, and then using the ref to get the data
 * back out from the DOM. This works, but it's not very elegant and should
 * be improved in the future.
 */

import React from 'react';
import { useEffect } from 'react';
import { useImperativeHandle, useState, useId, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAdvancedConfig, setAdvancedConfigSaved } from '../redux/viewSlice';
import { getAxesArray } from '../plot/plotUtils';
import { Tag, BooleanTag } from '../components/tags';
import { Input, FieldInput, GroupedField } from '../components/forms';
import { Button } from '../components/buttons';
import { useDarkMode } from '../hooks';

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
const ConfigViewArea = React.forwardRef((props, ref) => {

    const [rows, setRows] = useState("")
    const [cols, setCols] = useState("")
    const [rowPc, setRowPc] = useState("")
    const [colPc, setColPc] = useState("")

    // Return the data to the parent, with an indication of whether the data
    // are valid
    useImperativeHandle(ref, (r) => {
        return {
            getData: () => {
                return {
                    rows: rows,
                    cols: cols,
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
            setRowPc(new Array(rows).fill(100 / rows).join(","))
        }

        if (colPc == "") {
            setColPc(new Array(cols).fill(100 / cols).join(","))
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
    const valPosInt = (e, setter) => {
        let val
        val = parseFloat(e.target.value)
        if (val < 1) {
            val = 1
        }
        setter(val)
    }

    // Validate the row and column percentages - these must be comma separated
    // numbers which add up to 100
    const setter = (e, setter) => {
        let val = e.target.value
        setter(val)
        // validate()
    }

    return (
        <>
            <GroupedField>
                <Input type="number" placeholder="Number of rows" value={rows} onChange={(e) => valPosInt(e, setRows)} />
                <Input type="number" placeholder="Number of columns" value={cols} onChange={(e) => valPosInt(e, setCols)} />
            </GroupedField>
            <FieldInput type="text" placeholder="Row percentages (comma sep.)" value={rowPc} onChange={e => setter(e, setRowPc)} />
            <FieldInput type="text" placeholder="Column percentages (comma sep.)" value={colPc} onChange={e => setter(e, setColPc)} />
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
const ConfigPlotArea = React.forwardRef((props, ref) => {

    // Get the current plot configuration
    const options = useSelector(state => state.options)
    const paramOptions = useSelector(state => state.vars)

    // Get the axes array representation
    const axesStrings = getAxesArray(paramOptions)

    // Return the data to the parent
    useImperativeHandle(ref, (r) => {
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
const ConfigDashboardArea = React.forwardRef((props, ref) => {
    const paramOptions = useSelector(state => state.vars)

    const paramList = paramOptions.params.filter(x => x.selected).map(x => {
        return <Tag text={x.raw} is="info" extraClasses={"mr-1"} />
    })

    useImperativeHandle(ref, (r) => {
        return {
            getData: () => {
                return {
                    params: [...paramOptions.params.filter(x => x.selected).map(x => x.raw)],
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

/**
 * Display the configuration widget. 
 * 
 * @param {*} props - the react props
 * @param {boolean} props.visible - whether the widget is visible
 * @param {*} props.split - a callback to split the view
 * @param {*} props.hide - a callback to hide the widget
 * @param {*} props.setViewType - a callback to set the view type. Allowed values are
 *                                "plot", "tephi", "dashboard", "timers"
 * @param {*} props.setData - a callback to set the data for the view
 * @param {boolean} props.top - whether the widget is the ancestor view
 * 
 * @component
 * 
 */
const ConfigWidget = (props) => {

    const modalClass = props.visible ? "modal is-active" : "modal"
    const [widget, setWidget] = useState("VIEW")
    const dispatch = useDispatch()
    const viewRef = useRef()
    const plotRef = useRef()
    const dashRef = useRef()

    let wjsx

    switch (widget) {
        case "VIEW":
            wjsx = <ConfigViewArea split={props.split} ref={viewRef} />
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
        default:
            wjsx = null
    }

    /**
     * Get the class for the modal 
     */
    const getClass = (w) => {
        return widget === w ? "is-active" : ""
    }

    /**
     * Save the configuration
     * 
     * @param {*} e - the event
     */
    const saveAction = (e) => {
        let data
        switch (widget) {
            case "VIEW":
                // We're splitting the view
                data = viewRef.current.getData()
                if (!data.valid) {
                    return
                }
                props.hide()
                dispatch(setAdvancedConfigSaved(false))
                props.split(data.rows, data.cols, data.rowPc, data.colPc)
                break
            case "PLOT":
                // We're adding a plot
                props.setViewType("plot")
                data = plotRef.current.getData()
                props.setData({ ...data })
                props.hide()
                dispatch(setAdvancedConfigSaved(false))
                break
            case "TEPHI":
                // We're adding a tephigram
                props.setViewType("tephi")
                props.hide()
                dispatch(setAdvancedConfigSaved(false))
                break
            case "TIMERS":
                // We're adding a timer
                props.setViewType("timers")
                props.hide()
                dispatch(setAdvancedConfigSaved(false))
                break
            case "DASHBOARD":
                // We're adding a dashboard
                props.setViewType("dashboard")
                data = dashRef.current.getData()
                props.setData({ ...data })
                props.hide()
                dispatch(setAdvancedConfigSaved(false))
                break
        }
    }

    /**
     * Get the other tabs. If we're the top view, we don't show the
     * plot, tephigram or dashboard tabs, as the root view can't
     * contain those, and must be a view.
     * 
     * @returns {JSX.Element|null} - the other tabs if we're not the top view
     */
    const otherTabs = () => {
        if (props.top) return null

        return (
            <>
                <li className={getClass("PLOT")}><a onClick={() => setWidget("PLOT")}>Plot</a></li>
                <li className={getClass("TEPHI")}><a onClick={() => setWidget("TEPHI")}>Tephi</a></li>
                <li className={getClass("DASHBOARD")}><a onClick={() => setWidget("DASHBOARD")}>Dashboard</a></li>
                <li className={getClass("TIMERS")}><a onClick={() => setWidget("TIMERS")}>Timers</a></li>
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


const _AdvancedViewConfig = (props) => {


    const [nRows, setNRows] = useState(1)
    const [nCols, setNCols] = useState(1)
    const [rowPercent, setRowPercent] = useState([100])
    const [columnPercent, setColumnPercent] = useState([100])
    const [vType, setVType] = useState(props?.data?.type || "view")
    const [showWidget, setShowWidget] = useState(false)
    const [data, setData] = useState(props.data)
    const dispatch = useDispatch()
    const [darkMode, setDarkMode] = useDarkMode()


    const [children, setChildren] = useState([])

    const saved = useSelector(state => state.view.advancedConfigSaved)

    useEffect(() => {
        if (props.data) {
            setNRows(props.data.rows)
            setNCols(props.data.columns)
            setRowPercent(props.data.rowPercent)
            setColumnPercent(props.data.columnPercent)
            setVType(props.data.type)
            const children = []
            if (props.data.type === "view") {
                for (let element of props.data.elements) {
                    children.push(
                        <_AdvancedViewConfig id={element.id} data={element} showWidget={props.showWidget} />
                    )
                }
                setChildren(children)
            }
        }
    }, [props.data])

    // Currently disabled due to tricky bug!
    const resetToView = () => {
        setVType("view")
        dispatch(setAdvancedConfigSaved(false))
    }

    const innerHeight = window.innerHeight

    const split = (rows, columns, rowPc, colPc) => {
        setRowPercent(rowPc)
        setColumnPercent(colPc)
        setNCols(rows)
        setNRows(columns)

        const children = new Array(rows * columns).fill(null).map(
            (x, i) => <_AdvancedViewConfig id={i} showWidget={props.showWidget} />
        )

        setChildren(children)
    }

    const defaultBorder = {
        outline: darkMode ? "1px solid gray" : "1px solid black"
    }
    const borderStyle = saved
        ? defaultBorder
        : props.top
            ? { outline: "3px solid red" }
            : defaultBorder

    const style = {
        display: "grid",
        gridTemplateRows: rowPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        gridTemplateColumns: columnPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        width: props.top ? "100%" : "",
        height: props.top ? 2 * innerHeight / 3 : "",
        ...borderStyle
    }

    const getElement = () => {
        const dmFilter = darkMode ? "invert(63%) sepia(2%) saturate(13%) hue-rotate(331deg) brightness(86%) contrast(79%)" : ""

        const ImageElement = (props) => {
            return (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img onClick={resetToView} src={props.src} alt="plot" style={{ height: "64px", width: "64px", filter: dmFilter}} />
                </div>
            )
        }


        if (!children?.length) {
            switch (vType) {
                case "view":
                    return (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button.Info onClick={() => setShowWidget(true)}>
                                Configure
                            </Button.Info>
                        </div>
                    )
                case "plot":
                    return <ImageElement src="chart.svg" />
                case "tephi":
                    return <ImageElement src="tephi.svg" />
                case "dashboard":
                    return <ImageElement src="dashboard.svg" />
                case "alarms":
                    return <ImageElement src="alarm.svg" />
                case "timers":
                    return <ImageElement src="timer.svg" />
                case "url":
                    return <ImageElement src="link.svg" />
            }
        }
        return null
    }


    const gridElement = getElement()

    const widget = showWidget
        ? <ConfigWidget visible={showWidget}
            hide={() => setShowWidget(false)}
            split={split}
            top={props.top}
            setViewType={setVType}
            setData={setData} />
        : null

    const mappedChildren = children?.map((element, i) => {
        return (
            <div key={i} style={{ display: "grid" }}>
                {element}
            </div>
        )
    })

    const dataData = JSON.stringify(data)

    return (
        <>
            {widget}
            <div style={style} data-data={dataData} id={props.id} data-type={vType} data-nrows={nRows} data-ncols={nCols} data-rowpercent={rowPercent} data-colpercent={columnPercent}>
                {gridElement}
                {mappedChildren}
            </div>
        </>
    )
}


const AdvancedViewConfig = () => {
    const ref = useId()
    const currentConfig = useSelector(state => state.view.advancedConfig)
    const saved = useSelector(state => state.view.advancedConfigSaved)
    const dispatch = useDispatch()
    const [viewTitle, setViewTitle] = useState(currentConfig?.title || "")

    useEffect(() => {
        return () => dispatch(setAdvancedConfigSaved(true))
    }, [])

    const parseElement = (element) => {
        const allowedTypes = ["view", "plot", "tephi", "dashboard", "alarms", "timers", "url"]
        const eType = element.getAttribute("data-type")

        const getRowColPercent = (rowcol) => {
            const rowPercent = element.getAttribute(`data-${rowcol}percent`)
            if (rowPercent) {
                return rowPercent.split(",").map(parseFloat)
            }
            return [100]
        }

        const getNRowsNCols = (rowcol) => {
            const nRowsNCols = element.getAttribute(`data-n${rowcol}s`)
            if (nRowsNCols) {
                return parseInt(nRowsNCols)
            }
            return 1
        }

        if (eType === "view") {
            return {
                "type": "view",
                "rows": getNRowsNCols("row"),
                "columns": getNRowsNCols("col"),
                "rowPercent": getRowColPercent("row"),
                "columnPercent": getRowColPercent("col"),
                "elements": Array.from(element.children)
                    .map(x => x?.children[0])
                    .filter(x => allowedTypes.includes(x?.getAttribute("data-type")))
                    .map(parseElement)
            }
        }

        return {
            "type": eType,
            ...JSON.parse(element.getAttribute("data-data"))
        }
    }

    const saveCurrentConfig = () => {
        const a = document.getElementById(ref)
        let parsed = parseElement(a)
        parsed['title'] = viewTitle
        dispatch(setAdvancedConfig(parsed))
        dispatch(setAdvancedConfigSaved(true))
    }

    const resetCurrentConfig = () => {
        dispatch(setAdvancedConfig(null))
        setViewTitle("")
        dispatch(setAdvancedConfigSaved(true))
    }

    const launch = () => {
        saveCurrentConfig()
        localStorage.setItem("viewConfig", JSON.stringify(currentConfig))
        window.open("jsonview", "_blank")
    }

    const warning = saved
        ? null
        : (
            <article className="message is-danger">
                <div className="message-body">
                    <p>Config has changed. Ensure you save before navigating away from this page.</p>
                </div>
            </article>
        )

    return (
        <>
            {warning}
            <FieldInput placeholder="View Title" value={viewTitle} onChange={(e) => { setViewTitle(e.target.value) }} />
            <_AdvancedViewConfig top={true} data={currentConfig} id={ref} />
            <div className="is-flex is-justify-content-space-between mt-2">
                <div>
                    <Button.Success onClick={saveCurrentConfig}>Save</Button.Success>
                    <Button.Danger onClick={resetCurrentConfig}>Reset</Button.Danger>
                </div>
                <div>
                    <Button.Info onClick={launch}>Launch</Button.Info>
                </div>
            </div>
        </>
    )
}

export { AdvancedViewConfig }