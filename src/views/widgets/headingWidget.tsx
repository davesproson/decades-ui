import HeadingIndicator from "../../heading/heading"
import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"

const ConfigHeadingArea = () => {
    return (
        <div className="mt-2">
            Add a heading indicator to the view. There are no options
            associtated with this widget.
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
            props.hide()
        },
        icon: 'dashicons/heading.svg',
        component: HeadingIndicator
    })
}

export { useHeadingWidget }