import { useContext, useEffect } from "react"
import { MapContext } from "../context"
import TileLayer from "ol/layer/Tile"
import { OSM } from "ol/source"
import { useDecadesMapState } from "../hooks"

type BaseLayerProps = {
    url?: string,
    children?: never
}

const BaseLayer = (props: BaseLayerProps) => {
    const { state } = useContext(MapContext)
    const { state: { tileset } } = useDecadesMapState()

    useEffect(() => {
        if (!state.map) {
            return
        }

        const layer = new TileLayer({
            source: new OSM({
                url: props.url,
            }),
            zIndex: -10,
        })

        state.map.addLayer(layer)

        return () => {
            if (!state.map) {
                console.warn('Attempted to remove layer from map, but map was not set')
                return
            }
            state.map.removeLayer(layer)
        }

    }, [state.map, tileset])

    return null
}

export { BaseLayer }