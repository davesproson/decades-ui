import { DecadesDataResponse, DataMode, LIVE_DATA_MODE } from "./types"
import { apiEndpoints, serverProtocol } from "@/settings"
import { GetDataOptions } from "./types"
import { nowSecs } from "@/timeframe/utils"
import { PlotURLOptions } from "@/plot/types"

/**
 * Get data from the server
 * 
 * @param options - The plot options object
 * @param start - The start time
 * @param end - The end time
 *
 * @returns A promise that resolves to the data
 */
export const getData = async (
    options: GetDataOptions, start?: number, end?: number, mode: DataMode = LIVE_DATA_MODE
): Promise<DecadesDataResponse> => {

    if (start === undefined) start = nowSecs() - 5

    const url = getDataUrl(options, start, end, mode)

    const response = await fetch(url)
    return await response.json()

}

/** Tple selector for PlotURLOptions */
const isPlotURLOptions = (options: GetDataOptions): options is PlotURLOptions => {
    return (options as PlotURLOptions).caxis !== undefined
}

/**
 * Get the data url for a given set of options and start and end times
 *
 * @param options - The plot options object
 * @param start - The start time
 * @param end - The end time
 * @returns The data url
 */
export const getDataUrl = (options: GetDataOptions, start: number, end?: number, mode: DataMode = LIVE_DATA_MODE) => {
    const server = options.server ? options.server : location.host
    const { quickLookMode, qcJob } = mode as { quickLookMode: boolean, qcJob: number | null | undefined }

    let url = (qcJob && quickLookMode)
        ? new URL(`${apiEndpoints.quicklook_data}`)
        : new URL(`${serverProtocol}://${server}${apiEndpoints.data}`)

    if (qcJob && quickLookMode)
        url.searchParams.set('job', qcJob.toString())

    if (quickLookMode) {
        // TODO: this is terrible typeguarding
        if ('mask' in options) {
            url.searchParams.set('mask', options.mask.toString())
        }
    }

    // Allow the endpoint to include a query string
    url.searchParams.set('frm', start.toString())

    // If the end time is defined, add it to the url
    if (end) url.searchParams.set('to', end.toString())

    for (const para of options.params) {
        url.searchParams.append('para', para)
    }

    if (isPlotURLOptions(options)) {
        if (options.caxis) url.searchParams.append('para', options.caxis)
    }

    if (options.ordvar)
        url.searchParams.append('para', options.ordvar)

    return url.toString()
}