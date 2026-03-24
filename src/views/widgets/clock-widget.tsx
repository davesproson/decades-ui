import { WidgetConfiguration, ConfigWidgetProps } from "./types"
import { useEffect, useState } from "react"
import clockIcon from "@/assets/view-icons/clock.svg"

const ClockConfig = () => {
    return (
        <div className="mt-2">
            Add a digital clock with the current (UTC) time to the view.
            There are no options associated with this widget.
        </div>
    )
}

const ClockWidget = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const formatUTC = (date: Date) => {
        return date.toUTCString().split(' ')[4]
    }

    const formatUTCDate = (date: Date) => {
        return date.toUTCString().split(' ').slice(0, 4).join(' ')
    }

    return (
        <div className="relative inset-0 text-[2.5vw] font-mono flex justify-center">
            <div className="flex flex-col h-full justify-center align-middle">
                <div>
                    {formatUTC(time)}
                </div>
                <div className="text-[1.2vw] text-muted-foreground">
                    {formatUTCDate(time)}
                </div>
            </div>
        </div>
    )
}

export const clockWidgetConfig: WidgetConfiguration = {
    name: "Clock",
    type: "clock",
    configComponent: <ClockConfig />,
    save: (props: ConfigWidgetProps) => {
        props.setData({
            type: "clock",
        })
        return true
    },
    icon: clockIcon,
    tooltip: 'Display the current (UTC) time',
    component: ClockWidget
}
