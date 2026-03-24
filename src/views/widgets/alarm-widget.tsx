import type { AlarmProps } from "@/alarms/types"
import type { ConfigHandle, ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./types"
import AlarmList from "@/alarms/alarm"
import alarmIcon from "@/assets/view-icons/alarm.svg"
import { useSelector } from "@store"
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

const AlarmsConfigArea = forwardRef<ConfigHandle<Array<AlarmProps>>, {}>((_props, ref) => {
    const alarms = useSelector(state => state.alarms)
    console.log(alarms)

    useImperativeHandle(ref, () => {
        return {
            getData: () => {
                return Object.values(alarms.alarms)
            }
        }
    }, [alarms])

    return (
        <>
            These alarms will be added:
            <ul>
                {Object.values(alarms.alarms).map((alarm) => (
                    <li key={alarm.id}>{alarm.name}</li>
                ))}

            </ul>
        </>
    )
})

const useAlarmsWidget = (registry: RegistryType<WidgetConfiguration>, order?: number) => {
    const ref = useRef<ConfigHandle<Array<AlarmProps>>>(null)
    const widget = useMemo(() => ({
        name: "Alarms",
        type: "alarms",
        configComponent: <AlarmsConfigArea ref={ref} />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "alarms",
                alarms: ref.current?.getData()
            })
            return true
        },
        icon: alarmIcon,
        tooltip: 'Be alerted when data are out of spec',
        component: AlarmList
    }), []) // ref is stable — no deps needed
    registry.register(widget, order)
}

export { useAlarmsWidget }
