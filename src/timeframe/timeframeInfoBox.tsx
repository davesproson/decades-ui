import { useSelector } from "../redux/store"

const TimeframeInfoBox = () => {
    
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

export { TimeframeInfoBox }