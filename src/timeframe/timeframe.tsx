import { useState } from 'react'
import { useSelector, useDispatch } from '../redux/store'
import { setCustomTimeframe } from '../redux/optionsSlice'
import { getTimeLims } from '../plot/plotUtils'
import { useEffect } from 'react'
import { useFlightSummary } from './hooks'
import { useBrainFade } from '../hooks'
import { Button } from '../components/buttons'
import { FlightSummaryEntry, FlightSummaryEntryProps } from './timeframe.types'


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
    time?: number,
    boundary: "start" | "end",
    allowOngoing?: boolean,
    isOngoing?: boolean
}
const TimePicker = (props: TimePickerProps) => {

    const dispatch = useDispatch()
    const timeframes = useSelector(state => state.options.timeframes)
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe)
    const customTimeframe = useSelector(state => state.options.customTimeframe)
    
    const [isOngoing, setIsOngoing] = useState(props.isOngoing)// || false)

    let initHours = 0
    let initMinutes = 0
    let initSeconds = 0
    if(props.time) {
        initHours = new Date(props.time).getUTCHours()
        initMinutes = new Date(props.time).getUTCMinutes()
        initSeconds = new Date(props.time).getUTCSeconds()
    }

    const [hours, setHours] = useState(initHours)
    const [minutes, setMinutes] = useState(initMinutes)
    const [seconds, setSeconds] = useState(initSeconds)
    
    useEffect(() => {
        if(useCustomTimeframe) {
            const time = new Date(customTimeframe[props.boundary] || new Date())
            setHours(time.getUTCHours())
            setMinutes(time.getUTCMinutes())
            setSeconds(time.getUTCSeconds())
        } else {
            const lims = getTimeLims(timeframes.find(x => x.selected)?.label || "30min")
            const timeObj = {start: lims[0] * 1000, end: lims[1] * 1000}
            const time = new Date(timeObj[props.boundary])
            setHours(time.getUTCHours())
            setMinutes(time.getUTCMinutes())
            setSeconds(time.getUTCSeconds())
            if(props.boundary === "end") {
                setIsOngoing(true)
            }
        }
    }, [timeframes, useCustomTimeframe, setHours, setMinutes, setSeconds])


    const toggleOngoing = () => {
        const now = new Date()
        now.setUTCMilliseconds(0)
        const og = !isOngoing
        setIsOngoing(x=>!x)

        if (!og) {
            console.log('setting ongoing time')
            setHours(now.getUTCHours())
            setMinutes(now.getUTCMinutes())
            setSeconds(now.getUTCSeconds())
            const retval = og ? null :  now.getTime()
            return dispatch(setCustomTimeframe({[props.boundary]: retval}))
        }
        return dispatch(setCustomTimeframe({[props.boundary]: null}))
    }

    const onApply = () => {
        const time = new Date()
        time.setUTCHours(hours)
        time.setUTCMinutes(minutes)
        time.setUTCSeconds(seconds)
        time.setUTCMilliseconds(0)
        const retval = isOngoing ? null : time.getTime()
        dispatch(setCustomTimeframe({[props.boundary]: retval}))
    }

    const setAndPad = (setter: React.Dispatch<React.SetStateAction<number>>, event: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(event.target.value)
        setter(val)
    }

    
    const Btn = isOngoing ? Button.Primary : Button.Light

    const ongoingButton = props.allowOngoing 
        ? <Btn onClick={toggleOngoing}>Ongoing?</Btn>
        : null

    const timeSelector = isOngoing ? null : (
        <>
            <div className="control">
                <input  className="input" type="number" style={{width: "5em"}} 
                        value={hours?.toString()?.padStart(2, "0")} 
                        onChange={(e)=>setAndPad(setHours, e)} min="0" max="23"/>
            </div>
            <span className="mr-2 mt-2">:</span>
            <div className="control">
                <input  className="input" type="number" style={{width: "5em"}}
                        value={minutes?.toString()?.padStart(2, "0")}
                        onChange={(e)=>setAndPad(setMinutes, e)} min="0" max="59"/>
                        
            </div>
            <span className="mr-2 mt-2">:</span>
            <div className="control">
                <input className="input" type="number" style={{width: "5em"}} 
                       value={seconds?.toString()?.padStart(2, "0")} 
                       onChange={(e)=>setAndPad(setSeconds, e)} min="0" max="59"/>
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
                <Button.Primary fullWidth onClick={onApply}>Apply</Button.Primary>
            </div>
        </div>
        </>
    )
}

interface TimeFrameSelectorBoxProps {
    startTime: number,
    endOnGoing: boolean
}
const TimeFrameSelectorBox = (props: TimeFrameSelectorBoxProps) => {
    return (
        <nav className="panel mt-4 is-dark">
                <p className="panel-heading">
                    Select a timeframe
                </p>
                <div className="columns">
                    <div className="column is-6">
                        <TimePicker title="Start Time" time={props.startTime*1000} boundary="start"/>
                    </div>
                    <div className="column is-6">
                        <TimePicker title="End Time" allowOngoing={true} isOngoing={props.endOnGoing} boundary="end"/>
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
                        {filtered.map((x, i) => <li><FlightSummaryEntrySelector id={i} entry={x}/></li>)}
                    </ul>
                </div>
            </nav>
    )
}


const TimeframeSelector = () => {
    const timeframes = useSelector(state => state.options.timeframes)
    const usingCustomTimeframe = useSelector(state => state.options.useCustomTimeframe)
    const customTimeframe = useSelector(state => state.options.customTimeframe)
    const ref = useBrainFade<HTMLDivElement>()

    let timeframe = timeframes.find(tf => tf.selected)
    let startTime, endTime
    if(!usingCustomTimeframe) {
        if(!timeframe) {
            console.warn("Not using custom timeframe, but no timeframe selected.")
            // TODO: This should probably be a default value in the store.
            timeframe = {label: "30min", value: "30min", selected: true}
        }
        [startTime, endTime] = getTimeLims(timeframe.value)
        endTime = null
    } else {
        startTime = customTimeframe.start || new Date().getTime()
        endTime = customTimeframe.end
    }

    const endOnGoing = endTime === null

    return (
        <div ref={ref} className="container has-navbar-fixed-top">
            <TimeframeTextBox />
            <TimeFrameSelectorBox startTime={startTime} endOnGoing={endOnGoing}/>
            <FlightSummarySelector />
        </div>
    )

}

export default TimeframeSelector