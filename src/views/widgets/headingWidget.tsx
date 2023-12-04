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
        widget: <ConfigHeadingArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "heading",
            })
            props.hide()
        },
        icon: 'dashicons/heading.svg'
    })
}

export { useHeadingWidget }