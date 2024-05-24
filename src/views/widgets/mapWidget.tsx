import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"
import DecadesMap from "../../map/decadesMap"

const ConfigMapArea = () => {
    return (
        <div className="mt-2">
            Add a map to the view.
        </div>
    )
}

const useMapWidget = (registry: RegistryType<WidgetConfiguration>) => {
    registry.register({
        name: "Map",
        type: "map",
        configComponent: <ConfigMapArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "map",
            })
            return true
        },
        icon: 'dashicons/globe.svg',
        tooltip: 'Display a map of the aircraft position',
        component: DecadesMap
    })
}

export { useMapWidget }