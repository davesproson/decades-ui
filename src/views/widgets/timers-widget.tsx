import Timers from "@/timers/timers"
import type { TimerConfig } from "@/timers/types"
import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./types"
import timersIcon from "@/assets/view-icons/timer.svg"

const TimersConfigArea = () => {
    return (
        <div>
            <h1>Not yet implemented - configure in JSON</h1>
        </div>
    )
}

const useTimersWidget = (registry: RegistryType<WidgetConfiguration>) => {
    registry.register({
        name: "Timers",
        type: "timers",
        configComponent: <TimersConfigArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "timers",
            })
            return true
        },
        icon: timersIcon,
        tooltip: 'Display a countdown timer or stopwatch',
        component: (props: { initialTimers: Array<TimerConfig> }) => Timers(props),
    })
}

export { useTimersWidget }