import { useEffect, useState } from "react";
import { DecadesBanner } from "@/components/decades";
import { apiEndpoints } from "@/settings";
import { setQcJob, setFlightNumber, setQcJobs } from "@/redux/quicklookSlice";
import { useDispatch, useSelector } from "@store";
import { setParamsDispatched } from "@/redux/parametersSlice";
import { useScrollInhibitor } from "@/hooks";
import { setModeSelected, setQuickLookMode } from "./redux/configSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router"

type QuicklookJob = {
    flightNumber: string,
    flightDate: string,
    flightProject: string,
    jobID: string
}

type QuicklookJobResponseElement = {
    flight_number: string,
    flight_date: string,
    flight_project: string,
    url: string
}
type QuicklookJobResponse = {
    results: QuicklookJobResponseElement[]
}

const jobSortFn = (a: QuicklookJob, b: QuicklookJob) => {
    return new Date(b.flightDate).getTime() - new Date(a.flightDate).getTime()
}

const QuicklookSelector = () => {
    const [jobs, setJobs] = useState<QuicklookJob[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useScrollInhibitor(!jobs.length)

    useEffect(() => {
        fetch(apiEndpoints.quicklook_jobs)
            .then(response => response.json())
            .then((data: QuicklookJobResponse) => {
                setJobs(data.results.map(a => {
                    return {
                        flightNumber: a.flight_number,
                        flightDate: a.flight_date,
                        flightProject: a.flight_project,
                        jobID: a.url.split('/')[7]
                    }
                }))
                dispatch(setQcJobs(data.results.map(a => {
                    return {
                        flightNumber: a.flight_number,
                        flightDate: a.flight_date,
                        flightProject: a.flight_project,
                        jobID: a.url.split('/')[7]
                    }
                })))
            })
            .then(() => setLoading(false))
            .catch(() => {
                throw new Error("Failed to fetch quicklook jobs")
            })
        }, [])

    if(loading) {
        return (
            "Loading quicklook jobs..."
        )
    }

    const jobSelected = (job: QuicklookJob) => {
        dispatch(setParamsDispatched(false))
        dispatch(setQcJob(job.jobID))
        dispatch(setFlightNumber(job.flightNumber))
        navigate({to: "/"})
    }

    const reset = () => {
        dispatch(setQcJob(null))
        dispatch(setFlightNumber(null))
        dispatch(setParamsDispatched(false))
        dispatch(setQuickLookMode(false))
        dispatch(setModeSelected(false))
        navigate({to: "/"})
    }

    let content: React.ReactNode;
    if (jobs.length === 0) {
        content = (
            <div style={{ top: 0, bottom: 0, position: "fixed", left: 0, right: 0 }}>
                {/* <FlexCenter direction="column" extraStyle={{ height: "100%" }}> */}
                    <h2 className="title">
                        No flights are currently available to view
                    </h2>
                    <h3 className="subtitle">
                        Flight data typically becomes available within 24 hours of a flight,
                        and is available for viewing for approximately 2 weeks.
                    </h3>
                    <Button onMouseDown={reset}>
                        Back
                    </Button>
                {/* </FlexCenter> */}
            </div>
        )
    } else {
        content = jobs.sort(jobSortFn).map(job => {
            return (
                <Button key={job.flightNumber} className="m-1" onClick={() => jobSelected(job)}>
                    {job.flightNumber} ({job.flightProject}) {job.flightDate}
                </Button>
            )
        })
    }

    return (
        <>
            <DecadesBanner />
            {content}
        </>
    )
}

type ChildProps = {
    children: React.ReactNode
}

const QuicklookOnly = (props: ChildProps) => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)

    if (quickLookMode)
        return props.children

    return <></>

}

const LiveDataOnly = (props: ChildProps) => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)

    if (!quickLookMode)
        return props.children

    return <></>

}

export default QuicklookSelector;
export { QuicklookOnly, LiveDataOnly };