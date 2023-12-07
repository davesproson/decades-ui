import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useSelector } from '../../redux/store'
import { ConfigHandle, ConfigWidgetProps, RegistryType, WidgetConfiguration } from './widgets.types'
import { GaugePanelProps } from '../../gauge/gauge.types'
import { GaugePanel } from '../../gauge/gauge'

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
        icon: 'dashicons/gauge.svg',
        component: GaugePanel
    }
    registry.register(widget)
}

export { useGaugeWidget }
