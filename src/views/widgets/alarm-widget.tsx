
import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./types"
import AlarmList from "@/alarms/alarm"
import alarmIcon from "@/assets/view-icons/alarm.svg"

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
        icon: alarmIcon,
        tooltip: 'Be alerted when data are out of spec',
        component: AlarmList 
    })
}

export { useAlarmsWidget }
