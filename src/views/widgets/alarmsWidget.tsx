import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"
import AlarmList from "../../alarms/alarm"

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
        configComponent: <AlarmsConfigArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "alarms",
            })
            return true
        },
        icon: 'dashicons/alarm.svg',
        tooltip: 'Be alerted when data are out of spec',
        component: AlarmList 
    })
}

export { useAlarmsWidget }