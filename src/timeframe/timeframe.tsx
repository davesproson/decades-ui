import { useSelector, useDispatch } from '../redux/store'
import { setCustomTimeframe } from '../redux/optionsSlice'
import { getTimeLims } from '../plot/plotUtils'
import { useFlightSummary } from './hooks'
import { Button } from '../components/buttons'
import { FadeOut } from '../components/fadeout'
import { FlightSummaryEntry, FlightSummaryEntryProps } from './timeframe.types'
import { Container } from '../components/container'
import { LiveDataOnly, QuicklookOnly } from '../quicklook'


const TimeframeTextBox = () => {
    
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe)
    const customTimeframe = useSelector(state => state.options.customTimeframe)
    const timeframes = useSelector(state => state.options.timeframes)
    const timeframe = timeframes.find(x => x.selected)
    
    const padNum = (num: number) => {
        return num.toString().padStart(2, "0")
    }

    const timeString = (time: number) => {
        const date = new Date(time)
        const hours = padNum(date.getUTCHours())
        const minutes = padNum(date.getUTCMinutes())
        const seconds = padNum(date.getUTCSeconds())
        return `${hours}:${minutes}:${seconds}`
    }

    let text = ""
    if(useCustomTimeframe) {
        
        const startStr = timeString(customTimeframe.start || 0)
        text += `From ${startStr} `

        if(customTimeframe.end) {
            const endStr = timeString(customTimeframe.end)
            text += `to ${endStr}`
        } else {
            text += `and ongoing`
        }
    } else {
        if(timeframe) {
            text += `Last ${timeframe.label} and ongoing`
        }
    }

    return (
        <article className="message is-dark mt-2">
            <div className="message-body is-size-5">
                {text}
            </div>
        </article>
    )
}

interface TimePickerProps {
    title: string,
    boundary: "start" | "end",
    allowOngoing?: boolean,
}
const TimePicker = (props: TimePickerProps) => {
    const dispatch = useDispatch()
    const timeframes = useSelector(state => state.options.timeframes)
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe)
    const customTimeframe = useSelector(state => state.options.customTimeframe)

    const isOngoing = (!useCustomTimeframe) || customTimeframe.end === null
    
    const Btn = isOngoing ? Button.Primary : Button.Light

    const toggleOngoing = () => {
        if(customTimeframe.end === null) {
            dispatch(setCustomTimeframe({end: new Date().getTime()}))
        } else {
            dispatch(setCustomTimeframe({end: null}))
        }
    }

    const startTime = useCustomTimeframe
        ? customTimeframe.start || new Date().getTime() - (60000 * 30)
        : getTimeLims(timeframes.find(x=>x.selected)?.value || "30mins")[0] * 1000
    
    const endTime = useCustomTimeframe
        ? customTimeframe.end || new Date().getTime()
        : getTimeLims(timeframes.find(x=>x.selected)?.value || "30mins")[1] * 1000
    
    const time = props.boundary === "start" ? startTime : endTime

    const ongoingButton = props.allowOngoing
        ? <Btn onClick={toggleOngoing}>Ongoing?</Btn>
        : null

    const hours = props.boundary === "start"
        ? new Date(startTime).getUTCHours()
        : new Date(endTime).getUTCHours()

    const minutes = props.boundary === "start"
        ? new Date(startTime).getUTCMinutes()
        : new Date(endTime).getUTCMinutes()

    const seconds = props.boundary === "start"
        ? new Date(startTime).getUTCSeconds()
        : new Date(endTime).getUTCSeconds()

    const setTime = (unit: 'Hours' | 'Minutes' | 'Seconds', value: string) => {
        let sValue: string | number = value
        if(sValue === "") sValue = "0"
        const date = new Date(time)
        date[`setUTC${unit}`](parseInt(sValue))
        dispatch(setCustomTimeframe({
            ...customTimeframe,
            ...{[props.boundary]: date.getTime()}
        }))
    }

    const padToTwo = (num: number) => num.toString().padStart(2, "0").slice(-2)

    const timeSelector = (isOngoing && props.boundary === 'end') ? null : (
        <>
            <div className="control">
                <input  className="input" type="number" style={{width: "5em"}} 
                        value={padToTwo(hours)} 
                        onChange={(e)=>{setTime('Hours', e.target.value)}} min="0" max="23"/>
            </div>
            <span className="mr-2 mt-2">:</span>
            <div className="control">
                <input  className="input" type="number" style={{width: "5em"}}
                        value={padToTwo(minutes)}
                        onChange={(e)=>{setTime("Minutes", e.target.value)}} min="0" max="59"/>
                        
            </div>
            <span className="mr-2 mt-2">:</span>
            <div className="control">
                <input className="input" type="number" style={{width: "5em"}} 
                       value={padToTwo(seconds)}
                       onChange={(e)=>{setTime("Seconds", e.target.value)}} min="0" max="59"/>
            </div>
        </>
    )

    return (
        <>
            <div className="card m-2 ">
                <header className="card-header is-flex-grow-1">
                    <p className="card-header-title">
                        {props.title}
                    </p>
                </header>
                <div className="card-content">
                    <div className="field is-grouped">
                        {timeSelector}
                        {ongoingButton}
                    </div>
                </div>
            </div>
        </>
    )
}

const TimeFrameSelectorBox = () => {
    const quicklookMode = useSelector(state => state.config.quickLookMode)
    const dataTimeSpan = useSelector(state => state.quicklook.dataTimeSpan)
    const dispatch = useDispatch()

    const resetTimeframe = () => {
        if(!quicklookMode) return
        if(!dataTimeSpan) return
        dispatch(setCustomTimeframe(dataTimeSpan))
    }

    return (
        <nav className="panel mt-4 is-dark">
                <p className="panel-heading">
                    Select a timeframe
                </p>
                <QuicklookOnly>
                    <Button extraClasses='m-2' onClick={resetTimeframe}>Reset to entire dataset</Button>
                </QuicklookOnly>
                <div className="columns">
                    <div className="column is-6">
                        <TimePicker title="Start Time" boundary="start"/>
                    </div>
                    <div className="column is-6">
                        <TimePicker title="End Time" allowOngoing={true && !quicklookMode} boundary="end"/>
                    </div>
                </div>
            </nav>
    )
}


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
                        {filtered.map((x, i) => <li key={i}><FlightSummaryEntrySelector id={i} entry={x}/></li>)}
                    </ul>
                </div>
            </nav>
    )
}


const TimeframeSelector = () => {
    return (
        <FadeOut>
            <Container fixedNav>
                <TimeframeTextBox />
                <TimeFrameSelectorBox />
                <LiveDataOnly>
                    <FlightSummarySelector />
                </LiveDataOnly>
            </Container>
        </FadeOut>
    )
}

export default TimeframeSelector