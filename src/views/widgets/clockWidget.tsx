import { FlexCenter } from "../../components/layout"
import { RegistryType, WidgetConfiguration, ConfigWidgetProps } from "./widgets.types"
import { useEffect, useState } from "react"

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
        <div style={{ position: "relative", top: 0, left: 0, right: 0, bottom: 0, fontSize: "2vw" }}>
            <FlexCenter extraStyle={{ flexDirection: "column", height: "100%"}}>
                <div>
                    {formatUTC(time)}
                </div>
                <div style={{ fontSize: "1.2vw" }}>
                    {formatUTCDate(time)}
                </div>
            </FlexCenter>
        </div>
    )
}

const useClockWidget = (registry: RegistryType<WidgetConfiguration>) => {
    registry.register({
        name: "Clock",
        type: "clock",
        configComponent: <ClockConfig />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "clock",
            })
            return true
        },
        icon: 'dashicons/clock.svg',
        tooltip: 'Display the current (UTC) time',
        component: ClockWidget
    })
}

export { useClockWidget }