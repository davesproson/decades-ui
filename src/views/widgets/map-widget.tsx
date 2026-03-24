import type { ConfigWidgetProps, WidgetConfiguration } from "./types"
import DecadesMap from "@/map/decadesMap"
import mapIcon from "@/assets/view-icons/map.svg"

const ConfigMapArea = () => {
    return (
        <div className="mt-2">
            Add a map to the view.
        </div>
    )
}

export const mapWidgetConfig: WidgetConfiguration = {
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
    component: () => <DecadesMap withMenu={false} position="absolute" />,
}
