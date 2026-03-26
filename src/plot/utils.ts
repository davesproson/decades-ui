import type { GetDataOptions, GetDataPlotOptions } from "@/data/types"
import {
    wsProtocol, apiEndpoints, badData, useWebSocketData
} from '@/settings'

import type { PlotURLOptions } from './types'
import type { DecadesDataResponse } from "@/data/types"
import { DecadesParameter, ParamsState } from '@/redux/parametersSlice'
import { authFetch as fetch } from '@/utils'
import { getDataUrl } from "@/data/utils"
import { nowSecs, getTimeLims } from "@/timeframe/utils"


/**
 * Parses plot options to decide if the plot is ongoing (i.e. should be updated)
 * 
 * @param options
 * @param  options.timeframe - The timeframe of the plot 
 * @returns Whether the plot is ongoing
 */
const plotIsOngoing = (options: GetDataPlotOptions) => {
    const custom = options.timeframe.includes(',')
    const customOngoing = custom && options.timeframe.split(',')[1] === ''
    const defined = !custom
    return customOngoing || defined
}

/**
 * Get the parameter object from the parameters list by the raw name
 * 
 * @param {string} rawName - The name of the parameter as it appears calculations library
 * @param {Array} parameters - The list of parameters from the server
 * @returns {Object} - The parameter object from the parameters list
 */
const paramFromRawName = (rawName: string, parameters: Array<DecadesParameter>) => {
    const param = parameters.find(x => x.ParameterName === rawName)
    if (!param) {
        return {
            ParameterIdentifier: rawName,
            ParameterName: rawName,
            DisplayText: rawName,
            DisplayUnits: '?',
            available: null
        }
    }
    return param
}



/**
 * Parses plot options to decide if the plot can slide
 * 
 * @param options
 * @param options.timeframe - The timeframe of the plot
 * @returns Whether the plot can slide
 */
const canSlide = (options: PlotURLOptions) => {
    return plotIsOngoing(options) && options.scrolling
}

/**
 * Get the length of the sliding window in seconds
 * 
 * @param options
 * @param  options.timeframe - The timeframe of the plot
 * @returns The length of the sliding window in seconds
 */
const slideLength = (options: PlotURLOptions) => {
    let tf = options.timeframe
    let multiplier = 1
    if (tf.includes('h')) {
        multiplier = 60 * 60
    }
    if (tf.includes('m')) {
        multiplier = 60
    }

    tf = tf.replace(/[a-zA-Z]+/, '')

    return (parseFloat(tf) * multiplier).toString()
}


/**
 * Filters and maps data based on the provided options.
 *
 * @param options - An object containing plot URL options.
 * @param data - The data to be filtered and mapped.
 * @returns A tuple containing two arrays: xData and yData.
 * 
 * The function performs the following operations:
 * - Maps `utc_time` to milliseconds if `ordvar` is 'utc_time'.
 * - Maps bad data to null if `job` is specified in options
 * - Filters out bad data points if `job` is not specified in options.
 * - If `job` is specified, maps bad data to null without filtering.
 * 
 * @example
 * const options = {
 *   ordvar: 'utc_time',
 *   params: ['param1', 'param2'],
 *   job: false
 * };
 * const data = {
 *   utc_time: [1609459200, 1609459260, null],
 *   param1: [10, 20, badData],
 *   param2: [30, badData, 50]
 * };
 * const result = filterData(options, data);
 * // result will be a tuple containing filtered and mapped xData and yData arrays.
 */
const filterData = (options: PlotURLOptions, data: DataType) => {

    const ordVarIsBad = data[options.ordvar].map(x => x === badData)

    /**
     * Transform the time data to milliseconds if the ordinate variable is 'utc_time'
     * and the data is not null.
     * 
     * This function can be applied to the ordinate variable, and only acts on the data
     * if the ordinate variable is 'utc_time'.
     * 
     * @param data - The data to transform
     * @returns The transformed data
     */
    const timeMap = (data: number | null) => {
        return options.ordvar === 'utc_time'
            ? data === null
                ? null
                : data * 1000
            : data
    }

    // Map bad data to null
    const badDataMap = (data: number) => {
        return data === badData ? null : data
    }

    let yData: Array<Array<number | null>> = []
    let xData: Array<Array<number | null>> = []
    let cData: Array<Array<number | null>> = []

    if (!options.job) {
        // If the job is not specified, we're in real-time mode, so filter out bad data
        // withouth mapping it to null
        for (const param of options.params) {
            const paramIsBad = data[param].map(x => x === badData)
            const cDataIsBad = options.caxis
                ? data[options.caxis].map(x => x === badData)
                : data[param].map(() => false)

            const isBad = paramIsBad.map((x, i) => x || ordVarIsBad[i] || cDataIsBad[i])

            yData.push(data[param].filter((_x, i) => !isBad[i]))
            xData.push(data[options.ordvar].filter((_x, i) => !isBad[i]).map(timeMap))
            if (options.caxis) {
                cData.push(data[options.caxis].filter((_x, i) => !isBad[i]))
            }

        }
    } else {
        // When the job is specified, we're in quicklook mode, so map bad data to null
        // so we can mask flagged data
        for (const param of options.params) {
            yData.push(data[param].map(badDataMap))
            xData.push(data[options.ordvar].map(badDataMap).map(timeMap))
            if (options.caxis) {
                cData.push(data[options.caxis].map(badDataMap))
            }
        }
    }

    return [xData, yData, cData]
}

type DataType = {
    [key: string]: Array<number>
}
/**
 * Update the plot with new data
 * 
 * @param options - The plot options object
 * @param data - The data to plot
 * @param ref - The react ref to the plot
 * @returns void
 */
const updatePlot = (options: PlotURLOptions, data: DataType, ref: any/*TODO: type?*/) => {

    // Filter out bad data. It's not totally clear that this is the best option,
    // but leaving missing data in the plot causes issues with data < 1 Hz, or
    // data with regular gaps, e.g. the GIN data reformatted by the prtaft DLU.
    let [xData, yData, cData] = filterData(options, data)

    if (options.swapxy) {
        [yData, xData] = [xData, yData]
    }

    // TODO: This causes unexpected behaviour when the data are not actually 1 Hz
    const maxTraceLength = canSlide(options) ? parseInt(slideLength(options)) : undefined

    import('plotly.js-dist-min').then(Plotly => {

        Plotly.extendTraces(ref.current, {
            y: yData, x: xData
        }, [...Array(yData.length).keys()], maxTraceLength)

        if (options.caxis && options.params.length === 1) {
            const currentData = ref.current.data
            const newColorArray: Array<number> = [...currentData[0].marker.color, ...cData[0]]
            const validColors = newColorArray.filter(x => x !== badData)

            if (validColors.length > 0) {
                Plotly.restyle(ref.current, {
                    'marker.color': [newColorArray],
                    'marker.cmin': Math.min(...validColors),
                    'marker.cmax': Math.max(...validColors)
                } as any, 0)
            }
        }

    })
}

/**
 * Get the y axis for a given parameter, as referred to by plotly,
 * i.e. y or y2 etc.
 * 
 * @param options - The plot options object
 * @param  param - The parameter to get the y axis for
 * @returns The y axis for the parameter
 */
function getYAxis(options: PlotURLOptions, param: string) {
    for (let i = 0; i < options.axes.length; i++) {
        const paramsOnAxis = options.axes[i].split('|')[0].split(",")
        if (paramsOnAxis.includes(param)) {
            return i ? 'y' + (i + 1) : 'y'
        }
    }
}

/**
 * Get the x axis for a given parameter, as referred to by plotly,
 * i.e. x or x2 etc.
 * 
 * @param  options - The plot options object
 * @param param - The parameter to get the x axis for
 * @returns The x axis for the parameter
 */
function getXAxis(options: PlotURLOptions, param: string) {
    for (let i = 0; i < options.axes.length; i++) {
        const paramsOnAxis = options.axes[i].split('|')[0].split(",")
        if (paramsOnAxis.includes(param)) {
            return i ? 'x' + (i + 1) : 'x'
        }
    }
}

/**
 * Start listening for data from the server via a websocket. This is all
 * a bit buggy, but I just don't care enough to fix it.
 * 
 * @param {Object} options - The plot options object
 * @param {function} callback - The callback to call when data is fetched
 * @param {Object} ref - The react ref to the plot
 * @param {Object} signal - The signal object to abort the data fetch
 * @returns {void}
 */
interface StartDataArgs {
    options: PlotURLOptions,
    callback?: Function,
    onTimestamp?: (t: number) => void,
    ref: any,
    signal: any
}
const startDataWS = ({ options, callback, onTimestamp, ref, signal }: StartDataArgs) => {

    if (!callback) callback = updatePlot

    const server = options.server ? options.server : location.host
    const url = `${wsProtocol}://${server}${apiEndpoints.data_ws}`
    let consolidatedData: { [key: string]: Array<number> } = {}

    const ws = new WebSocket(url)

    ws.onopen = () => ws.send([options.ordvar, ...options.params].join(','))

    ws.onmessage = (event) => {
        if (signal.abort) {
            console.log('Aborting data fetch (WS) due to signal')
            ws.close()
            return
        }
        const data = JSON.parse(event.data)

        const oldTime = consolidatedData.utc_time ? consolidatedData.utc_time[0] : null
        const newTime = data[1] / 1000

        // If we have a new time, just move on and assume that any data that hasn't 
        // arrived yet is not going to arrive, so insert bad data for it
        if (oldTime && (newTime > oldTime)) {
            for (const param of [options.ordvar, ...options.params]) {
                if (!Object.keys(consolidatedData).includes(param)) {
                    consolidatedData[param] = [badData]
                }
            }
        }

        // Update the data object with the new data
        consolidatedData = {
            ...consolidatedData,
            [data[0]]: [data[2]],
            utc_time: [newTime],
        }

        // Check if we have all the data we need to update the plot
        let sendData = true
        for (const param of [options.ordvar, ...options.params]) {
            if (!(Object.keys(consolidatedData).includes(param))) {
                sendData = false
            }
        }

        // If we have all the data, update the plot
        if (sendData) {
            if (!callback) callback = updatePlot
            callback(options, consolidatedData, ref)
            onTimestamp?.(newTime)
            consolidatedData = { utc_time: [newTime] }
        }
    }
}

interface StartDataExtendedArgs extends StartDataArgs {
    start: number,
    end?: number
}
/**
 * Start fetching data from the server. This function will call itself
 * recursively to fetch data every second. This is done to avoid overloading
 * the server with requests if it is slow to respond.
 * 
 * @param args - The arguments object
 * @param args.options - The plot options object
 * @param args.start - The start time
 * @param args.end - The end time
 * @param args.callback - The callback to call when data is fetched
 * @param args.ref - The react ref to the plot
 * @param args.signal - The signal object to abort the data fetch
 * @returns void
 */
const startData = ({ options, start, end, callback, onTimestamp, ref, signal }: StartDataExtendedArgs) => {

    if (!callback) callback = updatePlot

    const url = getDataUrl(options, start, end)

    if (signal.abort) {
        console.log('Aborting data fetch due to signal')
        return
    }

    const callOpts = { options: options, callback: callback, onTimestamp: onTimestamp, ref: ref, signal: signal }
    let newStart = start;

    if (!(document.visibilityState === 'visible')) {
        setTimeout(() => {
            startData({ ...callOpts, start: newStart })
        }, 1000)
        return
    }


    /**
     * Check if all the latest data points are bad data.
     * 
     * @param {Object} data - The data object
     * @returns {boolean} - True if all the latest data points are bad data, false otherwise
     */
    const allLatestDataBad = (data: { [key: string]: Array<number> }) => {
        for (const param of Object.keys(data)) {
            if (data[param][data[param].length - 1] !== badData) {
                return false
            }
        }
        return true
    }


    try {
        fetch(url)
            .then(response => response.json())
            .then(data => {

                if (allLatestDataBad(data)) {
                    for (const param of Object.keys(data)) {
                        data[param].pop()
                    }
                }

                if (!callback) callback = updatePlot
                callback(options, data, ref)

                const lastTimestamp = data.utc_time[data.utc_time.length - 1]
                if (lastTimestamp !== undefined) {
                    const hasGoodParam = options.params.some(p => {
                        const arr = data[p]
                        return arr && arr.length > 0 && arr[arr.length - 1] !== badData
                    })
                    if (hasGoodParam) onTimestamp?.(lastTimestamp)
                }

                // GTFO if using websockets
                if (useWebSocketData) return startDataWS({ options, callback, onTimestamp, ref, signal })

                newStart = lastTimestamp + 1 || start

                setTimeout(() => {
                    startData({ ...callOpts, start: newStart })
                }, 1000)
            }).catch(e => {
                console.log('Error fetching data', e)
                setTimeout(() => {
                    startData({ ...callOpts, start: newStart })
                }, 1000)
            })
    } catch (e) {
        setTimeout(() => {
            startData({ ...callOpts, start: newStart })
        }, 1000)
    }
}

/**
 * Get data from the server
 * 
 * @param options - The plot options object
 * @param start - The start time
 * @param end - The end time
 *
 * @returns A promise that resolves to the data
 */
const getData = async (
    options: GetDataOptions, start?: number, end?: number
): Promise<DecadesDataResponse> => {

    if (start === undefined) start = nowSecs() - 5

    const url = getDataUrl(options, start, end)

    const response = await fetch(url)
    return await response.json()

}

interface TempAxisContainer {
    [key: string | number]: {
        params: Array<string>,
        scaling: {
            auto: boolean,
            min: string,
            max: string
        }
    }
}
/**
 * Build an axis array reprensenting the axes and parameters. This may look
 * something like:
 * 
 * ["x,y", "z"]
 * 
 * This would represent two axes, the first with x and y parameters, and the
 * second with z.
 * 
 * The scaling is also included if it is not auto, for example
 * 
 * ["x,y", "z|0:100"]
 * 
 * This would represent two axes, the first with x and y parameters, and the
 * second with z, with the scaling set to 0 to 100.
 * 
 * @param {*} vars - The redux parametersSlice
 * @returns {Array} - An array of the axes, with each axis being a comma separated
 *                    list of parameters, including the scaling if it is not auto
 */
const getAxesArray = (vars: ParamsState) => {
    const params = vars.params

    let axesObj: TempAxisContainer = {}
    for (const ax of vars.axes) {
        axesObj[ax.id] = {
            params: [],
            scaling: ax.scaling
        }
    }

    for (const param of params.filter(x => x.selected)) {
        if (!param.axisId) continue
        axesObj[param.axisId].params.push(
            param.raw
        )
    }

    return Object.values(axesObj).map(x => {
        let retval = x?.params?.join(',')
        if (x?.scaling?.auto === false) {
            retval += `|${x.scaling.min}:${x.scaling.max}`
        }
        return retval
    })
}

export {
    getData, startData, paramFromRawName, getYAxis, getXAxis, getTimeLims, updatePlot,
    plotIsOngoing, getAxesArray, canSlide, slideLength
}