import { useContext, useEffect, useRef, useState } from 'react';
import { ChatContext } from '@/chat/provider';
import { useSelector } from "@store";
import { base as siteBase, STALE_COOLDOWN_SECS, STALE_DATA_THRESHOLD_SECS } from '@/settings';
import { DataMode, LIVE_DATA_MODE } from '@/data/types';
import { nowSecs } from '@/timeframe/utils';
import { useDarkMode } from '@/components/theme-provider';
import { PlotInternalOptions, PlotURLOptions } from './types';
import {
    getAxesArray,
    getTimeLims,
    getXAxis,
    getYAxis,
    paramFromRawName,
    plotIsOngoing,
    startData
} from './utils';
import { useGetParameters } from '@/parameters/hooks';
// import { PlotSearchParams, Route } from '@/routes/plot';

const ShareIcon = {
    'width': 500,
    'height': 600,
    'path': 'M395.72,0c-48.204,0-87.281,39.078-87.281,87.281c0,2.036,0.164,4.03,0.309,6.029l-161.233,75.674 c-15.668-14.971-36.852-24.215-60.231-24.215c-48.204,0.001-87.282,39.079-87.282,87.282c0,48.204,39.078,87.281,87.281,87.281 c15.206,0,29.501-3.907,41.948-10.741l69.789,58.806c-3.056,8.896-4.789,18.396-4.789,28.322c0,48.204,39.078,87.281,87.281,87.281 c48.205,0,87.281-39.078,87.281-87.281s-39.077-87.281-87.281-87.281c-15.205,0-29.5,3.908-41.949,10.74l-69.788-58.805 c3.057-8.891,4.789-18.396,4.789-28.322c0-2.035-0.164-4.024-0.308-6.029l161.232-75.674c15.668,14.971,36.852,24.215,60.23,24.215 c48.203,0,87.281-39.078,87.281-87.281C482.999,39.079,443.923,0,395.72,0z'
}

// Options for dark mode. These are currently hard-coded, and disabled
const darkBg = "#0a0a0a";

interface OptionsState {
    params: string[],
    swapOrientation: boolean,
    scrollingWindow: boolean,
    dataHeader: boolean,
    plotStyle: string,
    timeframe: string,
    ordinateAxis: string,
    server: string | undefined,
    axes: string[],
    caxis: string | null,
    job?: number | null,
    mask: boolean
}

/**
 * Get the URL for the plot, given the current state of the plot options
 * 
 * @param {Object} options - The current state of the plot options
 * @param {string} options.timeframe - The timeframe to plot
 * @param {string} options.params - The parameters to plot
 * @param {boolean} options.swapOrientation - Whether to swap the x and y axes
 * @param {boolean} options.scrollingWindow - Whether to use a scrolling window
 * @param {boolean} options.dataHeader - Whether to include the data header
 * @param {string} options.plotStyle - The plot style to use
 * @param {string} options.ordinateAxis - The ordinate axis to use
 * @param {string} options.server - The server to use
 * @param {Array} options.axes - The axes to use
 * 
 * @returns {string} The URL for the plot
 */
const getUrl = (options: OptionsState) => {

    // Convert the axes options to an array of strings
    const axisStrings = options.axes.map(x => ([] as Array<string>).concat(x).join(','))

    // Iniitialise the URL
    const url = new URL(`${siteBase}plot`, window.location.origin)

    // Set the query parameters
    url.searchParams.set("timeframe", options.timeframe)
    url.searchParams.set("params", options.params.join(','))
    url.searchParams.set("swapxy", options.swapOrientation.toString())
    url.searchParams.set("scrolling", options.scrollingWindow.toString())
    url.searchParams.set("data_header", options.dataHeader.toString())
    url.searchParams.set("style", options.plotStyle)
    url.searchParams.set("ordvar", options.ordinateAxis)
    if (options.server) url.searchParams.set("server", options.server)
    if (options.job) url.searchParams.set("job", options.job.toString())
    if (options.caxis) url.searchParams.set("caxis", options.caxis)
    if (options.mask) url.searchParams.set("mask", options.mask.toString())
    // url.searchParams.set("server", options.server)
    for (const axStr of axisStrings) {
        url.searchParams.append("axis", axStr)
    }

    // Return the URL
    return url
}

/**
 * Hook to get the URL for the plot, given the current state of the plot options.
 * This hook will update the URL whenever the plot options change and set the
 * URL in the state.
 * 
 * @param {Object} override - An object containing any options to override
 * 
 * @returns {string} The URL for the plot
 * 
 */
const usePlotUrl = (override: { [key: string]: any } = {}) => {

    // Initialise local state
    const [plotUrl, setPlotUrl] = useState<URL>();

    // Initialise options from the store
    const plotOptions = useSelector(state => state.options);
    const axisOptions = useSelector(state => state.vars.axes);
    const vars = useSelector(state => state.vars);
    const server = useSelector(state => state.options.server);
    const qcJob = useSelector(state => state.quicklook.qcJob);
    const quickLookMode = useSelector(state => state.config.quickLookMode);
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe);

    // Get the parameters
    const params = vars.params

    // Get the selected parameters
    const selectedParams = params.filter(param => param.selected)
        .map(param => param.raw)

    // Given a key, return the value from the override object if it exists, or
    // the value from the plot options otherwise
    const overridden: (<T>(key: string, par: T) => T) = (
        (key, par) => override[key] ? override[key] : par
    )

    useEffect(() => {
        // Get the timeframe
        // We really need a more formalised way of dealing with seconds vs milliseconds
        let timeframe: string | undefined = ""
        if (useCustomTimeframe) {
            // A custom timeframe has been selected, this is represented as a start,stop
            // time in milliseconds. If the stop time is not set, we leave it blank, and
            // the plot will update as new data comes in

            const start = plotOptions?.customTimeframe?.start ? plotOptions.customTimeframe.start / 1000 : 0
            const end = plotOptions.customTimeframe.end ? plotOptions.customTimeframe.end / 1000 : ""
            timeframe = `${start},${end}`
        } else {
            // A preset timeframe has been selected, this is represented as a string
            // timeframe = plotOptions.timeframes.find(x=>x.selected).value;
            timeframe = plotOptions.timeframes.find(x => x.selected)?.value;
            if (!timeframe) timeframe = "30min"
        }

        // Build the axes array
        let axes = getAxesArray(vars)

        // Update the plot URL whenever the plot options change
        const optionSet: OptionsState = {
            timeframe: overridden("timeframe", timeframe),
            params: overridden("selectedParams", selectedParams),
            swapOrientation: overridden("swapxy", plotOptions.swapOrientation),
            scrollingWindow: overridden("scrolling", plotOptions.scrollingWindow),
            dataHeader: overridden("data_header", plotOptions.dataHeader),
            plotStyle: overridden("style", plotOptions.plotStyle.value),
            ordinateAxis: overridden("ordvar", plotOptions.ordinateAxis),
            server: overridden("server", server),
            axes: overridden("axes", axes),
            caxis: overridden("caxis", plotOptions.colorVariable),
            mask: overridden("mask", plotOptions.mask)
        }

        // We don't want to unset qcJob if we're toggling between quicklook and
        // live mode, so we only set it if we're in quicklook mode
        if (quickLookMode) {
            optionSet.job = overridden("job", qcJob)
        }

        setPlotUrl(getUrl(optionSet))

    }, [plotOptions, params, axisOptions])

    return plotUrl;
}

/**
 * Hook which manages a plot. This hook takes care of initialising the plot,
 * loading data, and updating the plot when the plot options change. Allegedly.
 * 
 * @param {Object} options - The current state of the plot options
 * @param {string} options.timeframe - The timeframe to plot
 * @param {string} options.params - The parameters to plot
 * @param {boolean} options.swapOrientation - Whether to swap the x and y axes
 * @param {boolean} options.scrollingWindow - Whether to use a scrolling window
 * @param {boolean} options.dataHeader - Whether to include the data header
 * @param {string} options.plotStyle - The plot style to use
 * @param {string} options.ordinateAxis - The ordinate axis to use
 * @param {string} options.server - The server to use
 * @param {Array} options.axes - The axes to use
 * 
 * @param {Object} ref - A reference to the plot container
 * 
 * @returns {boolean} Whether the plot has finished initialising. 
 */
const usePlot = (options: PlotURLOptions | undefined, ref: React.Ref<HTMLDivElement>) => {

    // Custom hooks
    const params = useGetParameters();
    const quicklookMode = useSelector(state => state.config.quickLookMode)
    const qcJob = useSelector(state => state.quicklook.qcJob)
    const { state: chatState, actions: chatActions } = useContext(ChatContext)

    const mode: DataMode = quicklookMode && qcJob !== null
        ? { quickLookMode: true, qcJob }
        : LIVE_DATA_MODE

    // Local state
    const [initDone, setInitDone] = useState(false)
    const [loadDone, setLoadDone] = useState(false)
    const [isStale, setIsStale] = useState(false)
    const [staleSeconds, setStaleSeconds] = useState(0)
    const [visibilityRevealCount, setVisibilityRevealCount] = useState(0)
    const lastTimestampRef = useRef<number | null>(null)
    const isCoolingDown = useRef(false)

    const ongoing = options ? plotIsOngoing(options) : false

    const darkMode = useDarkMode()

    const server = options?.server
    let plotLoadedAt = Math.floor(new Date().getTime() / 1000)

    // This effect starts the plot data fetching process. It only runs once,
    // when the plot is first initialised, indicated by the initDone flag.
    useEffect(() => {
        // Ensure that options are set. This is more for typesafety than anything
        if (!options) return

        // If the plot is already initialised, do nothing
        if (!initDone) return

        // A signal to abort the data fetching process
        const signal = { abort: false }

        // Get the start and end times for the plot, based on the timeframe
        const [start, end] = getTimeLims(options.timeframe)

        // Start the data fetching process
        startData({
            options: options,
            start: start,
            end: end,
            ref: ref,
            signal: signal,
            mode: mode,
            onTimestamp: (t: number) => { lastTimestampRef.current = t },
        })

        // If the plot is not ongoing, abort the data fetching process immediately
        if (!plotIsOngoing(options)) signal.abort = true

        // Cleanup - abort the data fetching process if the component is unmounted
        return () => { signal.abort = true }

    }, [initDone])

    // This godforsaken effect is responsible for loading the plot. It runs
    useEffect(() => {

        // If params or server are not set, do nothing
        if (!params) return
        if (!options) return

        // The number of axes to include in the plot
        const numAxes = options.axes.length;

        const colorParam = options.caxis ? paramFromRawName(options.caxis, params) : null

        // The plotly layout object
        const layout: any = {
            showlegend: true,
            plot_bgcolor: darkMode ? darkBg : "white",
            paper_bgcolor: darkMode ? darkBg : "white",
            font: {
                color: darkMode ? "white" : "black"
            },
            title: {
                text: options.caxis ? `${colorParam?.DisplayText} (${colorParam?.DisplayUnits})` : null,
                font: { size: 12 }
            },
            legend: {
                font: {
                    size: 8,
                    color: darkMode ? "white" : "black"
                },
                bgcolor: darkMode ? darkBg + 'cc' : "#ffffffcc",
                // This is dispicable, sorry future me
                x: options.swapxy
                    ? 0
                    : numAxes > 2
                        ? 0.05
                        : 0,
                y: options.swapxy
                    ? numAxes > 2
                        ? .95
                        : 1
                    : 1
            },
            margin: {
                t: 50
            },
            modebar: {
                remove: ["sendDataToCloud", "lasso", "lasso2d", "select", "select2d", "zoom", "pan",
                    "zoomIn2d", "zoomOut2d", "autoScale2d",
                    "hoverClosestCartesian"]
            }
        }

        const offsetStart = numAxes > 2 ? 0.05 : 0;
        const offsetEnd = numAxes > 3 ? 0.05 : 0;

        // Set the ordinate axis, depending on whether we're swapping the axes
        var _ordAxis = options.swapxy ? "yaxis" : "xaxis";

        // Latout for the ordinate axis
        layout[_ordAxis] = {
            linecolor: "black",
            mirror: true,
            domain: [offsetStart, 1 - offsetEnd],
        }

        // Set the title of the ordinate axis, and set the date attribute if 
        // we're plotting a timeseries
        if (options.ordvar.includes('utc_time')) {
            layout[_ordAxis].type = "date";
            layout[_ordAxis].title = "Time";
        } else {
            const ordParam = paramFromRawName(options.ordvar, params)
            layout[_ordAxis].title = `${ordParam.DisplayText} (${ordParam.DisplayUnits})`;
        }

        layout[_ordAxis].linecolor = darkBg ? "gray" : "black";
        if (darkMode) layout[_ordAxis].gridcolor = "gray";

        // Extract the ranges from the axes options. If no range is specified,
        // set the range to null.
        // Ranges are specified in the format "<axis>|min:max"
        const ranges = options.axes.map((axis: string) => {
            let rangeString: string | string[] = axis.split("|")[1]
            if (rangeString) {
                rangeString = rangeString.split(":")
                return [rangeString[0], rangeString[1]]
            }
            return null
        })

        for (let i = 0; i < numAxes; i++) {
            let _axisTitle;

            let currentAxes = options.axes[i].split("|")[0]

            // If there's more than one variable on a axis, label axis, axis2 etc.
            // Otherwise we can label with the DisplayName / DisplayUnits
            if (currentAxes.split(",").length > 1) {
                let _unit = paramFromRawName(currentAxes.split(",")[0], params)?.DisplayUnits || "Unknown units"
                _axisTitle = options.swapxy ? `X-axis ${i + 1} (${_unit})` : `Y-axis ${i + 1} (${_unit})`;
            } else {
                const _param = paramFromRawName(currentAxes, params)
                _axisTitle = `${_param?.DisplayText || 'y-axis'} (${_param?.DisplayUnits || 'Unknown units'})`;
            }

            let _axisName = options.swapxy ? "xaxis" : "yaxis";

            // We add coordinate axes alternatively to the left and right, or bottom and
            // top is swapAxes is true.
            let _side = i % 2 ? (options.swapxy ? "top" : "right") : (options.swapxy ? "bottom" : "left");
            let _overlaying: "x" | "y" | null = null;

            // If we're plotting more than two axes, we need to set the anchor and
            // position of the current axis. 
            let anchor = i > 1
                ? "free"
                : options.swapxy ? "y" : "x";

            // Axes are referred to as xaxis, xaxis2, xaxis3 etc. in plotly.
            if (i) {
                _axisName += (i + 1);
                _overlaying = options.swapxy ? "x" : "y"
            }

            // So sorry for this
            let position = anchor === "free"
                ? (i === 2 ? 0 : 1)
                : null;

            // Add the current axis to the layout.
            layout[_axisName] = {
                title: _axisTitle,
                titlefont: {
                    size: 10,
                },
                side: _side,
                overlaying: _overlaying,
                anchor: anchor,
                position: position,
                linecolor: darkMode ? "gray" : "black",
                gridcolor: darkMode ? "gray" : "lightgray",
                mirror: true
            }

            // If a range is specified for the current axis, set it.
            if (ranges[i]) {
                layout[_axisName].range = ranges[i]
            }

        }

        // Interface for the plotly traces we're going to add to the plot
        interface PlotlyTrace {
            type: string,
            x: Array<number>,
            y: Array<number>,
            name: string,
            yaxis: string,
            xaxis: string,
            line: {
                color?: string
            },
            mode?: string,
            marker?: {
                color?: Array<number>,
                colorscale?: string,
                cmin?: number,
                cmax?: number,
                size?: number,
                colorbar?: {
                    title?: string,
                    orientation?: string
                }
            }
        }

        // Initialise the plot traces
        const traces: PlotlyTrace[] = [];

        // For each parameter, add a trace to the plot
        for (var i = 0; i < options.params.length; i++) {
            var opts = {
                type: options.style,
                name: paramFromRawName(options.params[i], params)?.DisplayText || options.params[i],
                x: [],
                y: [],
                yaxis: options.swapxy ? 'y' : getYAxis(options, options.params[i]),
                xaxis: options.swapxy ? getXAxis(options, options.params[i]) : 'x',
                line: {},
            } as PlotlyTrace

            // Use markers if the style is scatter, or if a colour axis is set
            if (options.style === "scatter" || options.caxis) {
                opts.mode = "markers";
            } else {
                opts.mode = "lines";
            }

            // If the colour axis is set, configure the marker to use the colour axis
            if (options.caxis) {
                opts.marker = {
                    color: [],
                    size: 10,
                    colorscale: 'Viridis',
                    colorbar: {
                        orientation: 'h'
                    }
                }
            }

            // If a parameter name contains "red", "green" or "blue", set the line
            // colour to the corresponding colour, or people will get angry.
            // You wouldn't like them when they're angry.
            try {
                const paramName = paramFromRawName(options.params[i], params).DisplayText
                if (paramName.toLowerCase().includes('red')) opts.line.color = '#DD0000';
                if (paramName.toLowerCase().includes('green')) opts.line.color = '#00DD00';
                if (paramName.toLowerCase().includes('blue')) opts.line.color = '#0000DD';
            } catch (e) {
                console.error('Error setting line colour', e)
            }

            // Add the trace to the plot
            traces.push(opts);
        }

        // Plotly configuration
        const config = {
            responsive: true,
            displaylogo: false,
            modeBarButtonsToAdd: [
                {
                    name: "Download data",
                    icon: null,
                    click: () => {
                        const _data = traces.map(t => {
                            return {
                                x: t.x,
                                y: t.y,
                                name: t.name
                            }
                        })
                        const data = {
                            ordinate: layout[_ordAxis].title.text,
                            ordinateAxis: options.swapxy ? "y" : "x",
                            traces: _data
                        }
                        const element = document.createElement("a");
                        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
                        element.setAttribute('download', "plot-data.json");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    }
                },
                {
                    name: "Clear plot",
                    icon: null,
                    click: () => {
                        for (let t of traces) {
                            t.x = [t.x[t.x.length - 1]];
                            t.y = [t.y[t.y.length - 1]];
                        }
                    }
                }
            ]
        }

        if (chatState.config.chatActive && chatState.connectionStatus === 'Open' && !quicklookMode) {
            config.modeBarButtonsToAdd.push({
                name: "Share plot",
                // @ts-expect-error - ShareIcon is a React component, Plotly expects its own Icon type
                icon: ShareIcon,
                click: () => {
                    const url = new URL(window.location.href)
                    const [staticStart, now] = getTimeLims(options.timeframe)
                    if (staticStart < plotLoadedAt) plotLoadedAt = staticStart
                    url.searchParams.set("timeframe", `${plotLoadedAt},${now}`)
                    chatActions.sendChat(`Shared a plot: ${url.pathname}${url.search}`)
                }
            })
        }

        import('plotly.js-dist-min').then(Plotly => {
            setLoadDone(true);
            // @ts-expect-error - Plotly types icon as null initially but it accepts Icon at runtime
            config.modeBarButtonsToAdd[0].icon = Plotly.Icons.disk;
            // @ts-expect-error - Plotly types icon as null initially but it accepts Icon at runtime
            config.modeBarButtonsToAdd[1].icon = Plotly.Icons.eraseshape;

            // @ts-expect-error - ref may be a callback ref without .current; PlotlyTrace.type is string not a literal
            Plotly.newPlot(ref.current, traces, layout, config)
                .then(() => setInitDone(true))
        })

    }, [params, server, setInitDone, setLoadDone])

    // Suppress the stale overlay briefly when the tab becomes visible again, to avoid a
    // false alarm while the data feed restarts. Also increment visibilityRevealCount so
    // PlotDispatcher can reset the dismissed state on each reveal.
    useEffect(() => {
        if (!ongoing || quicklookMode) return

        let cooldownTimer: ReturnType<typeof setTimeout> | null = null

        const onVisibilityChange = () => {
            if (document.visibilityState !== 'visible') return
            if (cooldownTimer !== null) clearTimeout(cooldownTimer)
            isCoolingDown.current = true
            setIsStale(false)
            setVisibilityRevealCount(c => c + 1)
            cooldownTimer = setTimeout(() => {
                isCoolingDown.current = false
            }, STALE_COOLDOWN_SECS * 1000)
        }

        document.addEventListener('visibilitychange', onVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange)
            if (cooldownTimer !== null) clearTimeout(cooldownTimer)
        }
    }, [ongoing, quicklookMode])

    // Check for stale data once per second, but only for ongoing plots outside quicklook mode
    useEffect(() => {
        if (!ongoing || quicklookMode || !initDone) return

        const interval = setInterval(() => {
            if (lastTimestampRef.current === null) return
            const secs = Math.floor(nowSecs() - lastTimestampRef.current)
            if (secs > STALE_DATA_THRESHOLD_SECS && !isCoolingDown.current) setIsStale(true)
            if (secs <= STALE_DATA_THRESHOLD_SECS) setIsStale(false)
            setStaleSeconds(secs)
        }, 1000)

        return () => clearInterval(interval)
    }, [ongoing, quicklookMode, initDone])

    return { loadDone, isStale, staleSeconds, visibilityRevealCount }
}

/**
 * Parse the URL to get the plot options and return them as an object. If 
 * any of the options are given as input, they will override the URL options.
 * 
 * @param options
 * @param options.params - The parameters to plot
 * @param options.axes - The axes to plot on
 * @param options.timeframe - The timeframe to plot
 * @param options.swapxy - Whether to swap the x and y axes
 * @param options.scrolling - Whether to scroll the plot
 * @param options.style - The plot style
 * @param options.header - Whether to include the data header
 * @param options.ordvar - The ordinate variable
 * @param options.server - The server to plot from
 * @param options.caxis - The colour axis
 * @param options.job - The job number
 * @param options.mask - Whether to mask flagged data when in quicklook mode
 * 
 * @returns The plot options
 */
const usePlotOptions = (options: Partial<PlotInternalOptions> | undefined) => {

    if (!options) return undefined

    const searchParams = new URLSearchParams(window.location.search)

    const urlJob = (() => {
        return searchParams.get('job') === null
            ? null
            : parseInt(searchParams.get('job') || "") || null
    })()
    const job = options.job || urlJob

    const opts: PlotURLOptions = {
        params: options.params
            || (() => {
                const sparams: string | null = searchParams.get("params")
                return sparams ? sparams.split(",") : []
            })(),
        axes: options.axes || searchParams.getAll('axis') || [],
        timeframe: options.timeframe || (searchParams.get('timeframe') || "30min"),
        swapxy: options.swapxy || (searchParams.get('swapxy') === 'true' || false),
        scrolling: options.scrolling || (searchParams.get('scrolling') === 'true' || false),
        style: options.plotStyle || (searchParams.get('style') || "line"),
        header: options.data_header || (searchParams.get('data_header') === 'true' || false),
        caxis: options.caxis || searchParams.get('caxis') || "",
        ordvar: options.ordvar || (searchParams.get('ordvar') || "utc_time"),
        mask: options.mask || (searchParams.get('mask') === 'true' || false),
    }
    if (job) opts.job = job || null

    return opts
}

const usePlotInternalOptions = () => {
    // Get the plot options from the redux store and return them as an object
    const plotOptions = useSelector(state => state.options);
    const axisOptions = useSelector(state => state.vars.axes);
    const params = useSelector(state => state.vars.params);
    const quickLookMode = useSelector(state => state.config.quickLookMode);
    const qcJob = useSelector(state => state.quicklook.qcJob)
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe);

    let job: number | null = null;
    let timeframe: string | null = null;

    if (quickLookMode) {
        job = qcJob
    }

    if (useCustomTimeframe) {
        let start = plotOptions.customTimeframe.start
        let end = plotOptions.customTimeframe.end
        if (start) start = start / 1000
        if (end) end = end / 1000
        timeframe = `${start},${end}`
    } else {
        timeframe = plotOptions.timeframes.find(x => x.selected)?.value || "30min"
    }

    return {
        timeframe: timeframe,
        swapxy: plotOptions.swapOrientation,
        scrolling: plotOptions.scrollingWindow,
        style: plotOptions.plotStyle.value,
        header: plotOptions.dataHeader,
        ordvar: plotOptions.ordinateAxis,
        params: params.filter(x => x.selected).map(x => x.raw),
        axes: getAxesArray({
            params: params,
            axes: axisOptions,
            paramSet: 'default',
            paramsDispatched: true
        }),
        job: job,
        mask: plotOptions.mask
    } satisfies PlotURLOptions
}


// Module exports
export { getUrl, usePlot, usePlotInternalOptions, usePlotOptions, usePlotUrl };
