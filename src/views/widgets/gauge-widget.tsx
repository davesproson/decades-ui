import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useSelector } from '@store'
import type { ConfigHandle, ConfigWidgetProps, RegistryType, WidgetConfiguration } from './types'
import type { GaugePanelProps } from '@/gauges/types'
import { GaugePanel } from '@/gauges/gauges'
import gaugeIcon from '@/assets/view-icons/gauge.svg'

const ConfigGaugeArea = forwardRef((_props, ref) => {

    const gaugeOptions = useSelector(state => state.gauges)

    useImperativeHandle(ref, () => {
        return {
            getData: () => {
                return gaugeOptions
            }
        }
    })

    return (
        <div className="mt-2">
            Add one or more gauges to the view. See gauge configuration for more details.
        </div>
    )
})


const useGaugeWidget = (registry: RegistryType<WidgetConfiguration>) => {
    const ref = useRef<ConfigHandle<GaugePanelProps>>(null)
    const widget = {
        name: "Gauge",
        type: "gauge",
        configComponent: <ConfigGaugeArea ref={ref} />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "gauge",
                ...ref.current?.getData()
            })
            return true
        },
        icon: gaugeIcon,
        tooltip: 'Display one or more gauges - realtime parameter values',
        component: GaugePanel
    }
    registry.register(widget)
}

export { useGaugeWidget }