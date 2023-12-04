import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"

/**
 * Add a tephigram to the advanced view. We currenly just use the 
 * default tephigram options.
 * 
*/
const ConfigTephiArea = () => {
    return (
        <div className="mt-2">
            Add a tephigram to the view. Currently this will use
            the default tephigram options.
        </div>
    )
}

const useTephiWidget = (registry: RegistryType<WidgetConfiguration>) => {
    registry.register({
        name: "Tephigram",
        type: "tephi",
        widget: <ConfigTephiArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "tephi",
            })
            props.hide()
        },
        icon: 'dashicons/tephi.svg'
    })
}

export { useTephiWidget }