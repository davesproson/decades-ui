import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"

const AlarmsConfigArea = () => {
    return (
        <div>
            <h1>Not yet implemented - configure in JSON</h1>
        </div>
    )
}

const useAlarmsWidget = (registry: RegistryType<WidgetConfiguration>) => {
    registry.register({
        name: "Alarms",
        type: "alarms",
        widget: <AlarmsConfigArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "alarms",
            })
            props.hide()
        },
        icon: 'dashicons/alarm.svg'
    })
}

export { useAlarmsWidget }