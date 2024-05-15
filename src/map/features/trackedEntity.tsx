import { useContext, useEffect } from "react"
import { PositionDataHistory } from "../types"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { fromLonLat } from "ol/proj"
import Style from "ol/style/Style"
import Icon from "ol/style/Icon"
import VectorSource from "ol/source/Vector"
import { LineString } from "ol/geom"
import Stroke from "ol/style/Stroke"
import { VectorLayerContext } from "../layers/vector"

type TrackedEntityProps = {
    icon: {
        src: string,
        scale?: number,
    },
    history: PositionDataHistory,
    name?: string,
    updater?: Function,
    updateFrequency?: number
}


const TrackedEntity = (props: TrackedEntityProps) => {
    const { layer } = useContext(VectorLayerContext)

    useEffect(() => {
        if(!layer) return

        console.log('TrackedEntity: Initializing')
        layer.setZIndex(99)

        const vectorSource = new VectorSource()
        layer.setSource(vectorSource)

        // Init the icon feature
        const iconFeature = new Feature({
            geometry: new Point([0,0]),
            name: props.name 
        })
        const iconStyle = new Style({
            image: new Icon({
                src: props.icon.src,
                scale: props.icon.scale || 1,
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction'
            })
        })
        iconFeature.setStyle(iconStyle)
        vectorSource.addFeature(iconFeature)

        // Init the track feature
        const trackFeature = new Feature({
            geometry: new LineString([]),
            name: props.name ? `${props.name} track` : undefined
        })
        const trackStyle = new Style({
            stroke: new Stroke({
                color: 'blue',
                width: 3
            })
        })
        trackFeature.setStyle(trackStyle)
        vectorSource.addFeature(trackFeature)

        return () => {
            console.log('TrackedEntity: Cleaning up')
            vectorSource.clear()
            vectorSource.dispose()
        }
    }, [layer])


    useEffect(() => {
        if(!layer) return
        
        const trackFeature = layer.getSource()?.getFeatures()[0]
        const iconFeature = layer.getSource()?.getFeatures()[1]

        if(!trackFeature || !iconFeature) {
            console.warn('TrackedEntity: Could not find features in layer')
            return
        }

        const coords = props.history.map((loc) => fromLonLat([loc.lon, loc.lat]))
        const loc = props.history[props.history.length - 1]

        const trackGeometry = new LineString(coords)
        trackFeature.setGeometry(trackGeometry)

        if(loc?.heading !== undefined) {
            const iconRotation = (loc.heading || 0) * Math.PI / 180
            const iconStyle = iconFeature?.getStyle() as Style
            iconStyle.getImage()?.setRotation(iconRotation)
        }

        if (loc?.lat === undefined || loc?.lon === undefined) return
        iconFeature.setGeometry(new Point(fromLonLat([loc.lon, loc.lat])))

    }, [props.history, layer])

    return null
}

export { TrackedEntity }