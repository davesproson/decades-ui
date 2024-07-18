
import RollIndicator from "@/roll-indicator/roll-indicator"
import type { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./types"
import rollIcon from "@/assets/view-icons/roll.svg"

const ConfigRollArea = () => {
    return (
        <div className="mt-2">
            Add a roll indicator to the view. There are no options
            associated with this widget.
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
        icon: rollIcon,
        tooltip: 'Display an aircraft roll indicator',
        component: RollIndicator
    })
}

export { useRollWidget }
