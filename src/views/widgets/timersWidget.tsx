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
        widget: <TimersConfigArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "timers",
            })
            props.hide()
        },
        icon: 'dashicons/timer.svg'
    })
}

export { useTimersWidget }