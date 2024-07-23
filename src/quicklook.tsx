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
import Loader from "./components/loader";

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

    if (loading) {
        return (
            <Loader text="Loading flights..." />
        )
    }

    const jobSelected = (job: QuicklookJob) => {
        dispatch(setParamsDispatched(false))
        dispatch(setQcJob(job.jobID))
        dispatch(setFlightNumber(job.flightNumber))
        navigate({ to: "/" })
    }

    const reset = () => {
        dispatch(setQcJob(null))
        dispatch(setFlightNumber(null))
        dispatch(setParamsDispatched(false))
        dispatch(setQuickLookMode(false))
        dispatch(setModeSelected(false))
        navigate({ to: "/" })
    }

    let content: React.ReactNode;
    if (jobs.length === 0) {
        content = (
            <div className="fixed inset-0">
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-3xl font-medium">
                        No flights are currently available to view
                    </h2>
                    <h3 className="text-muted-foreground">
                        Flight data typically becomes available within 24 hours of a flight,
                        and is available for viewing for approximately 2 weeks.
                    </h3>
                    <Button className="mt-4" onMouseDown={reset}>
                        Back
                    </Button>
                </div>
            </div>
        )
    } else {
        content = jobs.sort(jobSortFn).map(job => {
            return (
                <Button key={job.flightNumber} className="m-1 w-[300px]" onClick={() => jobSelected(job)}>
                    {job.flightNumber} ({job.flightProject}) {job.flightDate}
                </Button>
            )
        })
    }

    return (
        <>
            <DecadesBanner />
            <div className="fixed inset-0 items-center justify-center flex flex-col">
                {content}
            </div>
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