import { DecadesBanner } from "@/components/decades";
import { setQcJob, setFlightNumber } from "@/redux/quicklookSlice";
import { useDispatch } from "@store";
import { setParamsDispatched } from "@/redux/parametersSlice";
import { useScrollInhibitor } from "@/hooks";
import { setModeSelected, setQuickLookMode } from "@/redux/configSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router"
import Loader from "@/components/loader";

import type { QuicklookJob } from "@/redux/quicklookSlice";
import { When } from "@/components/flow";
import { useQuicklookJobs } from "./hooks";



const jobSortFn = (a: QuicklookJob, b: QuicklookJob) => {
    const dateDiff = new Date(b.flightDate).getTime() - new Date(a.flightDate).getTime()
    if (dateDiff === 0) {
        return b.flightNumber.localeCompare(a.flightNumber)
    }
    return dateDiff
}

const QuicklookSelectorNoFlights = ({ onClick }: { onClick: () => void }) => {
    return (
        <div className="fixed inset-0">
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-3xl font-medium">
                    No flights are currently available to view
                </h2>
                <h3 className="text-muted-foreground">
                    Flight data typically becomes available within 24 hours of a flight,
                    and is available for viewing for approximately 2 weeks.
                </h3>
                <Button className="mt-4" onClick={onClick}>
                    Back
                </Button>
            </div>
        </div>
    )
}

const QuicklookSelectorFlightList = ({ jobs, onJobSelected }: { jobs: QuicklookJob[] | null, onJobSelected: (job: QuicklookJob) => void }) => {
    if(jobs === null) {
        console.error("QuicklookSelectorFlightList: jobs is null")
        return null
    }

    return (
        jobs.sort(jobSortFn).map(job => {
            return (
                <Button key={job.flightNumber} className="m-1 w-[300px]" onClick={() => onJobSelected(job)}>
                    {job.flightNumber} ({job.flightProject}) {job.flightDate}
                </Button>
            )
        })
    )
}

const QuicklookSelector = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { jobs, loading } = useQuicklookJobs()
    useScrollInhibitor(!jobs?.length)

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

    return (
        <>
            <DecadesBanner />
            <div className="fixed inset-0 items-center justify-center flex flex-col">
                <When condition={jobs === null || jobs.length === 0}>
                    <QuicklookSelectorNoFlights onClick={reset} />
                </When>
                <When condition={!!jobs?.length}>
                    <QuicklookSelectorFlightList jobs={jobs} onJobSelected={jobSelected} />
                </When>
            </div>
        </>
    )
}



export default QuicklookSelector;
export const testComponents = {
    QuicklookSelectorNoFlights,
    QuicklookSelectorFlightList
}
export const testFunctions = {
    jobSortFn
}