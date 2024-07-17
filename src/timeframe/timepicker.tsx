import { useDispatch, useSelector } from "@store"
import { setCustomTimeframe } from "../redux/optionsSlice"

import { Button } from "@/components/ui/button"
import { getTimeLims } from "./utils"
import { Input } from "@/components/ui/input"
import { CardContent } from "@/components/ui/card"

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
    
    const buttonVariant = isOngoing ? "default" : "outline"

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
        ? <Button variant={buttonVariant} className={"mt-2 " + (isOngoing ?  "" : "")} onClick={toggleOngoing}>Ongoing?</Button>
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
        <div className="flex mt-2">
            <Input  type="number" 
                    className="w-[5em]"
                    value={padToTwo(hours)} 
                    onChange={(e)=>{setTime('Hours', e.target.value)}}
                    min="0"
                    max="23" />

            <span className="m-2">:</span>

            <Input  type="number"
                    className="w-[5em]"
                    value={padToTwo(minutes)}
                    onChange={(e)=>{setTime("Minutes", e.target.value)}}
                    min="0"
                    max="59" />
                        
            <span className="m-2">:</span>

            <Input  type="number"
                    className="w-[5em] mr-2"
                    value={padToTwo(seconds)}
                    onChange={(e)=>{setTime("Seconds", e.target.value)}}
                    min="0"
                    max="59" />
        </div>
    )

    return (
        <>
            <CardContent>
            <p>{props.title}</p>
            <span className="flex flex-col lg:flex-row">
                {timeSelector}
                {ongoingButton}
            </span>
            </CardContent>
        </>
    )
}

export { TimePicker }