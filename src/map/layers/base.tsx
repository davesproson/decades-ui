import { useContext, useEffect } from "react"
import { MapContext } from "../context"
import TileLayer from "ol/layer/Tile"
import { OSM } from "ol/source"

type BaseLayerProps = {
    url?: string,
    children?: never
}

const BaseLayer = (props: BaseLayerProps) => {
    const { state } = useContext(MapContext)

    useEffect(() => {
        if (!state.map) {
            return
        }

        const layer = new TileLayer({
            source: new OSM({
                url: props.url
            })
        })

        state.map.addLayer(layer)

        return () => {
            if(!state.map) {
                console.warn('Attempted to remove layer from map, but map was not set')
                return
            }
            state.map.removeLayer(layer)
        }

    }, [state.map])

    return null
}

export { BaseLayer }