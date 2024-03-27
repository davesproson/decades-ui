import { useEffect, useState } from "react";
import { DecadesBanner } from "./components/decades";
import { apiEndpoints } from "./settings";
import { Button } from "./components/buttons";
import { Container } from "./components/container";
import { setQcJob, setFlightNumber } from "./redux/quicklookSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setParamsDispatched } from "./redux/parametersSlice";
import { useSelector } from "./redux/store";

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
    const dispatch = useDispatch()
    const navigator = useNavigate()

    useEffect(() => {
        fetch(apiEndpoints.quicklook_jobs)
            .then(response => response.json())
            .then((data: QuicklookJobResponse)  => {
                setJobs(data.results.map(a => {
                    return {
                        flightNumber: a.flight_number,
                        flightDate: a.flight_date,
                        flightProject: a.flight_project,
                        jobID: a.url.split('/')[7]
                    }
                }))
            })
    }, [])

    const jobSelected = (job: QuicklookJob) => {
        dispatch(setParamsDispatched(false))
        dispatch(setQcJob(job.jobID))
        dispatch(setFlightNumber(job.flightNumber))
        navigator("/")
    }

    return (
        <>
            <DecadesBanner />
            <Container>
            {
                jobs.sort(jobSortFn).map(job => {
                    return (
                        <Button.Dark key={job.flightNumber} fullWidth outlined extraClasses="m-1" onClick={()=>jobSelected(job)}>
                            {job.flightNumber} ({job.flightProject}) {job.flightDate}
                        </Button.Dark>
                    )
                })
            }
            </Container>
        </>
    )
}

type ChildProps = {
    children: React.ReactNode
}

const QuicklookOnly = (props: ChildProps) => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    
    if(quickLookMode)
        return props.children

    return <></>
    
}

const LiveDataOnly = (props: ChildProps) => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    
    if(!quickLookMode)
        return props.children

    return <></>
    
}

export default QuicklookSelector;
export { QuicklookOnly, LiveDataOnly };