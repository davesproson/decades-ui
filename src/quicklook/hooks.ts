import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from '@store'
import { setCustomTimeframe, setTimeframe } from '@/redux/optionsSlice'
import { apiEndpoints } from '@/settings'
import { QuicklookJob, setBasetime, setDataTimeSpan } from '@/redux/quicklookSlice'
import { authFetch as fetch } from '@/utils'
import { setQcJobs } from '@/redux/quicklookSlice'
import { QuicklookJobResponse, QuicklookJobResponseElement } from './types'

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
        if (!quickLookMode) {
            dispatch(setTimeframe({ value: '30min' }))
            return
        }

        // If there is no quicklook job, return early
        if (!qcJob) return

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
                dispatch(setCustomTimeframe({ start: startTime, end: endTime }))
                dispatch(setDataTimeSpan({ start: startTime, end: endTime }))

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

const apiJobToInteralJob = (job: QuicklookJobResponseElement): QuicklookJob => {
    return {
        flightNumber: job.flight_number,
        flightDate: job.flight_date,
        flightProject: job.flight_project,
        jobID: parseInt(job.url.split('/')[7])
    }
}

export const useQuicklookJobs = () => {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const jobs = useSelector(state => state.quicklook.qcJobs)

    useEffect(() => {
        fetch(apiEndpoints.quicklook_jobs)
            .then(response => response.json())
            .then((data: QuicklookJobResponse) => {
                dispatch(setQcJobs(data.results.map(apiJobToInteralJob)))
            })
            .then(() => setLoading(false))
            .catch((e) => {
                console.log(e)
                throw new Error("Failed to fetch quicklook jobs")
            })
    }, [setLoading, dispatch, setQcJobs])

    return { jobs: jobs ? [...jobs] : [], loading }
}

export const testFunctions = {
    apiJobToInteralJob
}