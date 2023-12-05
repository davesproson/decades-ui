import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"

const ConfigRollArea = () => {
    return (
        <div className="mt-2">
            Add a heading indicator to the view. There are no options
            associtated with this widget.
        </div>
    )
}

const useRollWidget = (registry: RegistryType<WidgetConfiguration>) => {
    registry.register({
        name: "Roll",
        type: "roll",
        widget: <ConfigRollArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "roll",
            })
            props.hide()
        },
        icon: 'dashicons/roll.svg'
    })
}

export { useRollWidget }