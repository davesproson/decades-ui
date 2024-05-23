import { useContext, useEffect, useRef } from 'react'
import { VectorLayerContext } from '../layers/vector'
import { DataContext } from '../context'
import Feature from 'ol/Feature'
import { LineString, Point } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Text from 'ol/style/Text'

import { getLength } from 'ol/sphere'
import { msToKnots } from '../../utils'

const AircraftMeasurement = ({lon, lat}: {lon: number, lat: number}) => {
    const { layer } = useContext(VectorLayerContext)
    const { aircraftData } = useContext(DataContext)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(!layer) return
        if(!aircraftData) return
        const line = new Feature({
            geometry: new LineString([
                fromLonLat([aircraftData.lon, aircraftData.lat]),
                fromLonLat([lon, lat])
            ])
        })

        line.setStyle(new Style({
            stroke: new Stroke({
                color: 'red',
                width: 2
            })
        }))

        
        const marker = new Feature({
            geometry: new Point(fromLonLat([lon, lat]))
        })
        const markerStyle = new Style()
        
        markerStyle.setImage(new Circle({
            radius: 2,
            stroke: new Stroke({
                color: "#000000",
                width: 2,
            }),
            fill: new Fill({
                color: "#ff0000",
            })
        }))
        
        marker.setStyle(markerStyle)


        const distance = getLength(new LineString([
            fromLonLat([aircraftData.lon, aircraftData.lat]),
            fromLonLat([lon, lat])
        ])) / (1000 * 1.852)

        let timeString = ''
        if(!aircraftData.groundSpeed || aircraftData.groundSpeed <= 10) {
            timeString = '?h ??m ??s'
        } else {
            const timeForDistance = distance / msToKnots(aircraftData.groundSpeed)
            const hours = Math.floor(timeForDistance)
            const minutes = Math.floor((timeForDistance - hours) * 60)
            const seconds = Math.floor(((timeForDistance - hours) * 60 - minutes) * 60)
            const m = minutes.toString().padStart(2, '0')
            const s = seconds.toString().padStart(2, '0')
            timeString = `${hours}h ${m}m ${s}s`
        }

        const fixedDistance = distance >= 100 ? distance.toFixed(0) : distance.toFixed(1)

        const label = new Feature({
            geometry: new Point(fromLonLat([lon, lat]))
        })
        label.setStyle(new Style({
            text: new Text({
                scale: 1.2,
                text: `${fixedDistance} NM\n${timeString}`,
                fill: new Fill({
                    color: "#000000",
                }),
                stroke: new Stroke({
                    color: "#ffffff",
                    width: 2,
                }),
                offsetY: 20,
                padding: [2, 2, 2, 2],
                backgroundFill: new Fill({
                    color: "rgba(0,0,0, 0.5)",
                }),
            })
        }))

        layer.getSource()?.addFeature(line)
        layer.getSource()?.addFeature(marker)
        layer.getSource()?.addFeature(label)

        return () => {
            layer.getSource()?.removeFeature(line)
            layer.getSource()?.removeFeature(marker)
            layer.getSource()?.removeFeature(label)
        }
    }, [layer, aircraftData, lon, lat, ref.current])

    return null
}

export { AircraftMeasurement }