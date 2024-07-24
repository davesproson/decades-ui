import { useEffect } from 'react'
import { useDispatch, useSelector } from '@store'
import { setCustomTimeframe, setTimeframe } from '@/redux/optionsSlice'
import { apiEndpoints } from '@/settings'
import { setBasetime, setDataTimeSpan } from '@/redux/quicklookSlice'

/**
 * A hook to set the custom timeframe for the quicklook plot. This hook
 * fetches the UTC time from the quicklook data endpoint and sets the
 * custom timeframe in the store.
 * 
 * TODO: Why is this here? This should probably be in the quicklook module.
 * 
 * @returns 
 */
export const useQuickLookTimeframe = () => {
    const qcJob = useSelector(state => state.quicklook.qcJob)
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    const dispatch = useDispatch()

    useEffect(() => {

        if(!quickLookMode) {
            dispatch(setTimeframe({value: '30min'}))
            return
        }

        // If there is no quicklook job, return early
        if(!qcJob) return

        // Build the query URL
        const dataURL = new URL(apiEndpoints.quicklook_data)
        dataURL.searchParams.set('job', qcJob.toString())
        dataURL.searchParams.set('para', 'utc_time')

        // Fetch the data and set the custom timeframe
        fetch(dataURL)
        .then(response => response.json())
        .then(data => {
            const time = data.utc_time
            const startTime = time[0] * 1000
            const endTime = time[time.length - 1] * 1000
            dispatch(setCustomTimeframe({start: startTime, end: endTime}))
            dispatch(setDataTimeSpan({start: startTime, end: endTime}))

            // Set the basetime to the start of the day on which the flight
            // started
            const baseTime = (time[0] - (time[0] % (24 * 3600))) * 1000
            dispatch(setBasetime(baseTime))
        })
        .catch(e => {
            console.error("Error fetching quicklook timeframe:", e)
        })  
    }, [qcJob, quickLookMode])
}