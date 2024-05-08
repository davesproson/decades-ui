import { useContext, useEffect, useState } from "react"
import { DataContext, MapContext } from "../context"
import { PositionData, PositionDataHistory } from "../types"
import VectorLayer from "ol/layer/Vector"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { fromLonLat } from "ol/proj"
import Style from "ol/style/Style"
import Icon from "ol/style/Icon"
import VectorSource from "ol/source/Vector"
import { LineString } from "ol/geom"
import Stroke from "ol/style/Stroke"

type TrackedEntityProps = {
    icon: {
        src: string,
        scale?: number,
    },
    name?: string,
    updater?: Function,
    updateFrequency?: number
}

const TrackedEntity = (props: TrackedEntityProps) => {
    const { state } = useContext(MapContext)
    const [loc, setLoc] = useState<PositionData>({ lat: 0, lon: 0, time: 0 })
    const [track, setTrack] = useState<PositionDataHistory>([])
    const [layer, setLayer] = useState<VectorLayer<VectorSource> | null>(null)
    const { aircraftData, aircraftHistory } = useContext(DataContext)

    useEffect(() => {
        if (!props.updater) return
        props.updater(setLoc)

        const interval = setInterval(() => {
            if(!props.updater) return
            props.updater(setLoc)
        }, props.updateFrequency || 1000)

      return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (loc.lat === null || loc.lon === null || loc.time === null) return
        if (!props.updater) return
        setTrack((prev) => [...prev, loc])
    }, [loc])

    useEffect(() => {
        if(props.updater !== undefined) return
        setTrack(aircraftHistory)
    }, [aircraftHistory])

    useEffect(() => {
        if(props.updater !== undefined) return
        setLoc(aircraftData)
    }, [aircraftData])

    useEffect(() => {
        if (!state.map) return
        const vectorLayer = new VectorLayer()
        vectorLayer.setZIndex(99)
        const vectorSource = new VectorSource()
        vectorLayer.setSource(vectorSource)

        // Init the icon feature
        const iconFeature = new Feature({
            geometry: new Point(fromLonLat([0, 0])),
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
        const coords = track.map((loc) => fromLonLat([loc.lon, loc.lat]))
        const trackFeature = new Feature({
            geometry: new LineString(coords),
            name: 'track'
        })
        const trackStyle = new Style({
            stroke: new Stroke({
                color: 'blue',
                width: 3
            })
        })
        trackFeature.setStyle(trackStyle)
        vectorSource.addFeature(trackFeature)

        state.map.addLayer(vectorLayer)
        setLayer(vectorLayer)
        return () => {
            if(!state.map) {
                console.warn('Attempted to remove layer from map, but map was not set')
                return
            }
            state.map.removeLayer(vectorLayer)
        }
    }, [state.map])

    useEffect(() => {
        if(!layer) return
        const iconFeature = layer.getSource()?.getFeatures().find(
            (feature) => feature.get('name') === props.name || 'feature'
        )

        if(!iconFeature) {
            console.warn('Icon feature not found')
            return
        }

        const coords = fromLonLat([loc.lon, loc.lat])
        const rotation = (loc.heading || 0) * Math.PI / 180
        const style = iconFeature.getStyle() as Style

        iconFeature.setGeometry(new Point(coords))
        style.getImage()?.setRotation(rotation)
    }, [loc])

    useEffect(() => {
        if(!layer) return
        
        const trackFeature = layer.getSource()?.getFeatures().find(
            (feature) => feature.get('name') === 'track'
        )
        if(!trackFeature) return
        const coords = track.map((loc) => fromLonLat([loc.lon, loc.lat]))
        const geometry = new LineString(coords)
        trackFeature.setGeometry(geometry)
    }, [track])




    return null
}

export { TrackedEntity }