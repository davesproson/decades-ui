import PitchIndicator from "@/pitch-indicator/pitch-indicator"
import type { ConfigWidgetProps, WidgetConfiguration } from "./types"
import rollIcon from "@/assets/view-icons/roll.svg"

const ConfigArea = () => {
    return (
        <div className="mt-2">
            Add a pitch indicator to the view. There are no options
            associated with this widget.
        </div>
    )
}

export const pitchWidgetConfig: WidgetConfiguration = {
    name: "Pitch",
    type: "pitch",
    configComponent: <ConfigArea />,
    save: (props: ConfigWidgetProps) => {
        props.setData({
            type: "pitch",
        })
        return true
    },
    icon: rollIcon,
    tooltip: 'Display an aircraft pitch indicator',
    component: PitchIndicator
}
