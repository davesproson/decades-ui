import { Button } from "../components/buttons"
import { getTimeLims } from "../plot/plotUtils"
import { setCustomTimeframe } from "../redux/optionsSlice"
import { useDispatch, useSelector } from "../redux/store"

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

export { TimePicker }