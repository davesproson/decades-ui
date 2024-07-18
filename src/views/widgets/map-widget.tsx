import type { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./types"
import DecadesMap from "@/map/decadesMap"
import mapIcon from "@/assets/view-icons/map.svg"

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
        icon: mapIcon,
        tooltip: 'Display a map of the aircraft position',
        component: DecadesMap
    })
}

export { useMapWidget }