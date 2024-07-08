import { setCustomTimeframe } from "../redux/optionsSlice"
import { useDispatch } from "../redux/store"
import { useFlightSummary } from "./hooks"
import { FlightSummaryEntry, FlightSummaryEntryProps } from './timeframe.types'

const FlightSummaryEntrySelector = (props: FlightSummaryEntryProps) => {
    const dispatch = useDispatch()

    const setTimeframe = (start: number, end: number) => {
        dispatch(setCustomTimeframe({start: start, end: end}))
    }

    const formatTime = (time: number) => {
        const date = new Date(time)
        return date.toLocaleTimeString()
    }

    const fromMs = props.entry.start.time * 1000
    const toMs = props.entry.stop.time * 1000
    const from = formatTime(fromMs)
    const to = formatTime(toMs)

    const tagStyle = (() => {
        const evt = props.entry.event
        if(evt.startsWith("Run")) {
            return "is-success"
        }
        if(evt.startsWith("Profile")) {
            return "is-warning"
        }
        if(evt.startsWith("Orbit")) {
            return "is-info"
        }
        return "is-light"
    })()

    return (
        <div className="mt-2">
            <span className="is-size-5">
                <a className="is-primary" onClick={()=>setTimeframe(fromMs, toMs)}><span className={`tag is-medium ${tagStyle} mr-2`}> {props.entry.event}</span> from {from} until {to}</a>
            </span>
        </div>
    )
}

const FlightSummarySelector = () => {
    const fs = useFlightSummary()

    const filterFlightSummary = (fs: Array<FlightSummaryEntry>) => {
        if(!fs) {
            return []
        }
        const asArray = Object.values(fs).sort(x=>-x?.start?.time)
        
        return asArray.filter(x=>x?.start?.time && x?.stop?.time)     
    }

    const filtered = filterFlightSummary(fs)
    

    return (
        <nav className="panel mt-4 is-dark">
                <p className="panel-heading">
                    Flight summary events
                </p>
                <div className="panel-block">
                    <ul>
                        {filtered.map((x, i) => (
                            <li key={i}>
                                <FlightSummaryEntrySelector id={i} entry={x}/>
                            </li>)
                        )}
                    </ul>
                </div>
            </nav>
    )
}

export { FlightSummarySelector }