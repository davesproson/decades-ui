import PitchIndicator from "../../pitch/pitch"
import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"

const ConfigArea = () => {
    return (
        <div className="mt-2">
            Add a pitch indicator to the view. There are no options
            associtated with this widget.
        </div>
    )
}

const usePitchWidget = (registry: RegistryType<WidgetConfiguration>) => {
    registry.register({
        name: "Pitch",
        type: "pitch",
        configComponent: <ConfigArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "pitch",
            })
            props.hide()
        },
        icon: 'dashicons/roll.svg',
        component: PitchIndicator
    })
}

export { usePitchWidget }