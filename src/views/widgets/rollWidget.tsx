import RollIndicator from "../../roll/roll"
import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"

const ConfigRollArea = () => {
    return (
        <div className="mt-2">
            Add a roll indicator to the view. There are no options
            associtated with this widget.
        </div>
    )
}

const useRollWidget = (registry: RegistryType<WidgetConfiguration>) => {
    registry.register({
        name: "Roll",
        type: "roll",
        configComponent: <ConfigRollArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "roll",
            })
            return true
        },
        icon: 'dashicons/roll.svg',
        component: RollIndicator
    })
}

export { useRollWidget }