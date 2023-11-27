import { 
    serverProtocol, wsProtocol, apiEndpoints, badData, useWebSocketData 
} from '../settings'

import { DecadesDataResponse, PlotURLOptions } from './plot.types'
import { DecadesParameter, ParamsState } from '../redux/parametersSlice'
import { TephigramOptions } from '../tephigram/tephigram.types'
import { DashboardOptions } from '../dashboard/dashboard.types'
import { AlarmOptions } from '../alarms/alarm.types'

type GetDataOptions =  PlotURLOptions 
                        | TephigramOptions
                        | (AlarmOptions & {ordvar?: string})
                        | (DashboardOptions & {ordvar?: string})
type GetDataPlotOptions = PlotURLOptions | TephigramOptions

/**
 * Get the parameter object from the parameters list by the raw name
 * 
 * @param {string} rawName - The name of the parameter as it appears calculations library
 * @param {Array} parameters - The list of parameters from the server
 * @returns {Object} - The parameter object from the parameters list
 */
const paramFromRawName = (rawName: string, parameters: Array<DecadesParameter>) => {
    const param = parameters.find(x => x.ParameterName === rawName)
    if(!param) {
        console.log(`Parameter ${rawName} not found in parameters list, assuming raw`)
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
 * Get the current time in seconds
 * 
 * @returns The current time in seconds
 */
const nowSecs = () => {
    return Math.floor(new Date().getTime() / 1000)
}

/**
 * Get the start and end times for a given time frame
 * 
 * @param tf - The time frame to get the start and end times for
 * @returns The start and end times for the time frame
 */
const getTimeLims = (tf: string): [number, number] => {

    if(tf.includes(",")) {
        const times = tf.split(",")
        let startTime = parseInt(times[0])
        let endTime
        try {
            endTime = parseInt(times[1])
        } catch {
            endTime = nowSecs()
        }
        return [startTime, endTime]
    }

    const end = nowSecs()

    if (tf === 'all') {
        return [0, end]
    }
    
    let multiplier = 1
    if(tf.includes('h')) {
        multiplier = 60 * 60
    }
    if(tf.includes('m')) {
        multiplier = 60
    }

    tf = tf.replace(/[a-zA-Z]+/, '')

    const start = end - parseFloat(tf) * multiplier

    return [start, end]
}

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
 * Parses plot options to decide if the plot can slide
 * 
 * @param options
 * @param options.timeframe - The timeframe of the plot
 * @returns Whether the plot can slide
 */
const canSlide = (options: PlotURLOptions) => {
    return !options.timeframe.includes(',') && options.scrolling
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
    if(tf.includes('h')) {
        multiplier = 60 * 60
    }
    if(tf.includes('m')) {
        multiplier = 60
    }

    tf = tf.replace(/[a-zA-Z]+/, '')

    return (parseFloat(tf) * multiplier).toString()
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

    // Map utc_time to milliseconds
    const timeMap = (data: number) => {
        return options.ordvar == 'utc_time' ? data * 1000 : data
    }

    // Map bad data to null
    // const badDataMap = (data: number) => {
    //     return data == badData ? null : data
    // }

    let yData: Array<Array<number>> = []
    let xData: Array<Array<number>> = []
    // Filter out bad data. It's not totally clear that this is the best option,
    // but leaving missing data in the plot causes issues with data < 1 Hz, or
    // data with regular gaps, e.g. the GIN data reformatted by the prtaft DLU.
    for(const param of options.params) {
        const paramIsBad = data[param].map(x => x === badData)
        const ordVarIsBad = data[options.ordvar].map(x => x === badData)

        const isBad = paramIsBad.map((x, i) => x || ordVarIsBad[i])

        yData.push(data[param].filter((_x, i) => !isBad[i]))
        xData.push(data[options.ordvar].filter((_x, i) => !isBad[i]).map(timeMap))
        
    }

    if(options.swapxy) {
        const temp = xData
        xData = yData
        yData = temp
    }

    const maxTraceLength = canSlide(options) ? parseInt(slideLength(options)) : undefined
    
    import('plotly.js-dist-min').then(Plotly => { 
        Plotly.extendTraces(ref.current, {
            y: yData, x: xData
        }, [...Array(yData.length).keys()], maxTraceLength)
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
    for(let i=0; i<options.axes.length; i++) {
        const paramsOnAxis = options.axes[i].split('|')[0].split(",")
        if(paramsOnAxis.includes(param)) {
            return i ? 'y' + (i+1) : 'y'
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
    for(let i=0; i<options.axes.length; i++) {
        const paramsOnAxis = options.axes[i].split('|')[0].split(",")
        if(paramsOnAxis.includes(param)) {
            return i ? 'x' + (i+1) : 'x'
        }
    }
}

/**
 * Get the data url for a given set of options and start and end times
 * 
 * @param options - The plot options object
 * @param start - The start time
 * @param end - The end time
 * @returns The data url
 */
const getDataUrl = (options: GetDataOptions, start: number, end?: number) => {
    const server = options.server ? options.server : location.host
    let url = `${serverProtocol}://${server}${apiEndpoints.data}`

    // Allow the endpoint to include a query string
    if(url.includes('?')) {
        url += `&frm=${start}`
    } else {
        url += `?frm=${start}`
    }

    // If the end time is defined, add it to the url
    if(end) {
        url += `&to=${end}`
    }

    for (const para of options.params) {
        url += `&para=${para}`
    }

    if(options.ordvar) {
        url += `&para=${options.ordvar}`
    }

    return url
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
    ref: any,
    signal: any
}
const startDataWS = ({options, callback, ref, signal}: StartDataArgs) => {

    if(!callback) callback = updatePlot

    const server = options.server ? options.server : location.host
    const url = `${wsProtocol}://${server}${apiEndpoints.data_ws}`
    let consolidatedData: {[key: string]: Array<number>} = {}

    const ws = new WebSocket(url)

    ws.onopen = () => ws.send([options.ordvar, ...options.params].join(','))

    ws.onmessage = (event) => {
        if(signal.abort) {
            console.log('Aborting data fetch (WS) due to signal')
            ws.close()
            return
        }
        const data = JSON.parse(event.data)

        const oldTime = consolidatedData.utc_time ? consolidatedData.utc_time[0] : null
        const newTime = data[1] / 1000

        // If we have a new time, just move on and assume that any data that hasn't 
        // arrived yet is not going to arrive, so insert bad data for it
        if(oldTime && (newTime > oldTime)) {
            for(const param of [options.ordvar, ...options.params]) {
                if(!Object.keys(consolidatedData).includes(param)) {
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
        for(const param of [options.ordvar, ...options.params]) {
            if(!(Object.keys(consolidatedData).includes(param))) {
                sendData = false
            }
        }

        // If we have all the data, update the plot
        if(sendData) {
            if(!callback) callback = updatePlot
            callback(options, consolidatedData, ref)
            consolidatedData = {utc_time: [newTime]}
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
const startData = ({options, start, end, callback, ref, signal}: StartDataExtendedArgs) => {

    if(!callback) callback = updatePlot

    const url = getDataUrl(options, start, end)

    if(signal.abort) {
        console.log('Aborting data fetch due to signal') 
        return
    }

    const callOpts = {options: options, callback: callback, ref: ref, signal: signal}


    /**
     * Check if all the latest data points are bad data.
     * 
     * @param {Object} data - The data object
     * @returns {boolean} - True if all the latest data points are bad data, false otherwise
     */
    const allLatestDataBad = (data: {[key: string]: Array<number>}) => {
        for(const param of Object.keys(data)) {
            if(data[param][data[param].length-1] !== badData) {
                return false
            }
        }
        return true
    }

    let newStart = start;

    try {
        fetch(url)
            .then(response => response.json())
            .then(data => {

                if(allLatestDataBad(data)) {
                    for(const param of Object.keys(data)) {
                        data[param].pop()
                    }
                }

                if(!callback) callback = updatePlot
                callback(options, data, ref)

                // GTFO if using websockets
                if(useWebSocketData) return startDataWS({options, callback, ref, signal})
                
                newStart = data.utc_time[data.utc_time.length-1] + 1 || start
                
                setTimeout(() => {
                    startData({...callOpts, start: newStart})
                }, 1000)      
            }).catch(e => {
                console.log('Error fetching data', e)
                setTimeout(() => {
                    startData({...callOpts, start: newStart})
                }, 1000)   
            })
    } catch(e) {
        setTimeout(() => {
            startData({...callOpts, start: newStart})
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

    if(!start) start = nowSecs() - 5

    const url = getDataUrl(options, start, end)

    return fetch(url).then(response => response.json())

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
    for(const ax of vars.axes) {
        axesObj[ax.id] = {
            params: [],
            scaling: ax.scaling
        }
    }

    for(const param of params.filter(x=>x.selected)) {
        if(!param.axisId) continue
        axesObj[param.axisId].params.push(
            param.raw
        )
    }

    return Object.values(axesObj).map(x=>{
        let retval = x?.params?.join(',')
        if(x?.scaling?.auto === false) {
            retval += `|${x.scaling.min}:${x.scaling.max}`
        }
        return retval
    })
}

export { 
    getData, startData, paramFromRawName, getYAxis, getXAxis, getTimeLims, updatePlot,
    plotIsOngoing, getAxesArray
}
