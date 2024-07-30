import { DecadesDataResponse } from "./types"
import { apiEndpoints, serverProtocol } from "@/settings"
import { GetDataOptions } from "./types"
import { nowSecs } from "@/timeframe/utils"
import store from '@store'

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
    options: GetDataOptions, start?: number, end?: number
): Promise<DecadesDataResponse> => {

if(start===undefined) start = nowSecs() - 5

const url = getDataUrl(options, start, end)

const response = await fetch(url)
return await response.json()

}

/**
 * Get the data url for a given set of options and start and end times
 *
 * @param options - The plot options object
 * @param start - The start time
 * @param end - The end time
 * @returns The data url
 */
export const getDataUrl = (options: GetDataOptions, start: number, end?: number) => {
    const server = options.server ? options.server : location.host
    const job = store.getState().quicklook.qcJob
    const quicklookMode = store.getState().config.quickLookMode

    let url = (job && quicklookMode)
        ? new URL(`${apiEndpoints.quicklook_data}`)
        : new URL(`${serverProtocol}://${server}${apiEndpoints.data}`)

    if(job && quicklookMode)
        url.searchParams.set('job', job.toString())

    // Allow the endpoint to include a query string
    url.searchParams.set('frm', start.toString())

    // If the end time is defined, add it to the url
    if(end) url.searchParams.set('to', end.toString())

    for (const para of options.params) {
        url.searchParams.append('para', para)
    }

    if(options.ordvar)
        url.searchParams.append('para' ,options.ordvar)

    return url.toString()
}