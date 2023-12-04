import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"
import { onLuxe } from "../../utils"

const MapView = (props: {url: string}) => {
    return (
        <iframe src={props.url} 
             style={{border: "none", overflow: "hidden", width: "100%", height: "100%"}}/>
            
    )
}

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
        widget: <ConfigMapArea />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "map",
                url: onLuxe()
                    ? "http://192.168.101.105/gluxe/position"
                    : "https://www.faam.ac.uk/gluxe/position"
            })
            props.hide()
        },
        icon: 'dashicons/globe.svg'
    })
}

export { useMapWidget, MapView }