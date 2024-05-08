import { useContext, useEffect } from "react"
import { Position } from "../types"
import { VectorLayerContext } from "../layers/vector"
import Feature from "ol/Feature"
import LineString from "ol/geom/LineString"
import { fromLonLat, toLonLat } from "ol/proj"
import Style from "ol/style/Style"
import Stroke from "ol/style/Stroke"
import { getLength } from "ol/sphere"
import Point from "ol/geom/Point"
import Text from "ol/style/Text"
import Fill from "ol/style/Fill"
import { MapContext } from "../context"
import VectorSource from "ol/source/Vector"
import Draw, { DrawEvent } from "ol/interaction/Draw"
import { SimpleGeometry } from "ol/geom"

const LineMeasurement = ({ startPos, endPos }: { startPos: Position, endPos: Position }) => {
    const { layer } = useContext(VectorLayerContext)

    useEffect(() => {
        if (!layer) return
        
        const line = new Feature({
            geometry: new LineString([
                fromLonLat([startPos.lon, startPos.lat]),
                fromLonLat([endPos.lon, endPos.lat])
            ])
        })
        line.setStyle(new Style({
            stroke: new Stroke({
                color: 'red',
                width: 2
                })
            }))

        layer.getSource()?.addFeature(line)

        const distance = getLength(new LineString([
            fromLonLat([startPos.lon, startPos.lat]),
            fromLonLat([endPos.lon, endPos.lat])
        ])) / (1000 * 1.852)
        const fixedDistance = distance >= 100 ? distance.toFixed(0) : distance.toFixed(1)

        const halfwayCoord = line.getGeometry()?.getCoordinateAt(0.5)
        if(!halfwayCoord) return

        const label = new Feature({
            geometry: new Point(halfwayCoord)
        })
        label.setStyle(new Style({
            text: new Text({
                text: `${fixedDistance} NM`,
                scale: 1.2,
                fill: new Fill({
                    color: 'white',
                }),
                padding: [2, 2, 2, 2],
                backgroundFill: new Fill({
                    color: 'black'
                }),
            })
        }))

        layer.getSource()?.addFeature(label)

        return () => {
            if(!layer) return
            layer.getSource()?.removeFeature(line)
            layer.getSource()?.removeFeature(label)
        }
    }, [layer, startPos, endPos])

    return null
}

type LineMeasurementProps = {
    active: boolean,
    addMeasurement: (startPos: Position, endPos: Position) => void
}
const LineMeasurementInteraction = ({ active, addMeasurement }: LineMeasurementProps) => {
    const { layer } = useContext(VectorLayerContext)
    const { state } = useContext(MapContext)

    useEffect(() => {
        if (!layer || !state.map) return
        if (!active) return

        const interaction = new Draw({
            source: new VectorSource(),
            type: 'LineString',
            maxPoints: 2
        })

        state.map?.addInteraction(interaction)
        const f = (e: DrawEvent) => {
            const coords = (e.feature.getGeometry() as SimpleGeometry)?.getCoordinates()
            if(!coords) return
            if(coords.length < 2) return
            const [startLon, startLat] = toLonLat(coords[0])
            const [endLon, endLat] = toLonLat(coords[1])
            const startPos = { lon: startLon, lat: startLat }
            const endPos = { lon: endLon, lat: endLat }
            addMeasurement(startPos, endPos)
        }
        interaction.on('drawend', f)

        return () => {
            state.map?.removeInteraction(interaction)
            interaction.un('drawend', f)
        }
    }, [layer, state.map, active])

        
    return null
}

export { LineMeasurement, LineMeasurementInteraction }