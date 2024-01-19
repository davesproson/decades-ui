import Timers from "../../timers/timer"
import { TimerConfig } from "../../timers/timers.types"
import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"

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
        icon: 'dashicons/timer.svg',
        tooltip: 'Display a countdown timer or stopwatch',
        component: (props: { initialTimers: Array<TimerConfig> }) => Timers(props),
    })
}

export { useTimersWidget }