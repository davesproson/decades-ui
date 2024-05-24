import { useContext, useEffect } from "react"
import { VectorLayerContext } from "../layers/vector"
import { MapContext } from "../context"
import VectorSource from "ol/source/Vector"
import Draw, { DrawEvent } from "ol/interaction/Draw"
import Stroke from "ol/style/Stroke"
import Fill from "ol/style/Fill"
import Style from "ol/style/Style"
import { DecadesMapModality, DrawModeType } from "../types"

const Interaction = ({ type }: {type: DrawModeType}) => {
    const { layer } = useContext(VectorLayerContext)
    const { state } = useContext(MapContext)

    useEffect(() => {
        if (!layer || !state.map) return

        const source = layer.getSource() as VectorSource || new VectorSource()

        if(type === DecadesMapModality.DELETE_DRAWING) {
            console.log("Clearing interaction")
            source.clear()
            return
        }

        if(type === null) {
            return
        }
        
        const finalStyle =  new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new Stroke({
                color: '#ff6622',
                width: 3,
            })
        })

        const interaction = new Draw({
            source: source,
            type: type,
        })

        const setDoneStyle = (e: DrawEvent) => {
            e.feature.setStyle(finalStyle)
        }

        interaction.on('drawend', setDoneStyle)
        state.map?.addInteraction(interaction)

        return () => {
            state.map?.removeInteraction(interaction)
            interaction.un('drawend', setDoneStyle)
        }
    }, [layer, state.map, type])

    return null
}

const Drawings = ({drawMode}: {drawMode: DrawModeType}) => {
    if (drawMode === null || drawMode === undefined) return null
    return <Interaction type={drawMode} />
}

export { Drawings }