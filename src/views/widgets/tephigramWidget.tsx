import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"
import { containerStyle } from "./utils"
import { TephigramOptions } from "../../tephigram/tephigram.types"
import Tephigram from "../../tephigram/tephigram"


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
        configComponent: <ConfigTephiArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "tephi",
            })
            return true
        },
        icon: 'dashicons/tephi.svg',
        tooltip: 'Display a tephigram',
        component: (props: TephigramOptions) => Tephigram({ ...props, containerStyle: containerStyle }),
    })
}

export { useTephiWidget }