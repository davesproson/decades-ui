import HeadingIndicator from "@/heading-indicator/heading-indicator"
import type { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./types"
import headingIcon from "@/assets/view-icons/heading.svg"

const ConfigHeadingArea = () => {
    return (
        <div className="mt-2">
            Add a heading indicator to the view. There are no options
            associated with this widget.
        </div>
    )
}

const useHeadingWidget = (registry: RegistryType<WidgetConfiguration>) => {
    registry.register({
        name: "Heading",
        type: "heading",
        configComponent: <ConfigHeadingArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "heading",
            })
            return true
        },
        icon: headingIcon,
        tooltip: 'Display an aircraft heading indicator',
        component: HeadingIndicator
    })
}

export { useHeadingWidget }