import { useContext, useEffect, useState } from "react"
import { MapContext } from "../context"
import VectorLayer from "ol/layer/Vector"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { fromLonLat } from "ol/proj"
import Style from "ol/style/Style"
import Icon from "ol/style/Icon"
import VectorSource from "ol/source/Vector"

type TrackedEntityProps = {
    icon: {
        src: string,
        scale?: number,
        name?: string
    },
    updater: Function,
    updateFrequency?: number
}

type Track = {
    lat: number[],
    lon: number[],
    time: number[]
}

type PointData = {
    lat: number,
    lon: number,
    time: number
}

const TrackedEntity = (props: TrackedEntityProps) => {
    const { state } = useContext(MapContext)
    const [loc, setLoc] = useState<PointData>({ lat: 0, lon: 0, time: 0 })
    const [track, setTrack] = useState<Track>({ lat: [], lon: [], time: [] })
    const [layer, setLayer] = useState<VectorLayer<VectorSource> | null>(null)

    useEffect(() => {
        props.updater(setLoc)
        const interval = setInterval(() => {
            props.updater(setLoc)
        }, props.updateFrequency || 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (loc.lat === null || loc.lon === null || loc.time === null) return
        setTrack({
            lat: [...track.lat, loc.lat],
            lon: [...track.lon, loc.lon],
            time: [...track.time, loc.time]
        })
    }, [loc])

    useEffect(() => {
        if (!state.map) return
        const vectorLayer = new VectorLayer()
        const vectorSource = new VectorSource()
        vectorLayer.setSource(vectorSource)
        const iconFeature = new Feature({
            geometry: new Point(fromLonLat([0, 0])),
            name: props.icon.name
        })
        const iconStyle = new Style({
            image: new Icon({
                src: props.icon.src,
                scale: props.icon.scale || 1,
            })
        })
        iconFeature.setStyle(iconStyle)
        vectorSource.addFeature(iconFeature)
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
        const iconFeature = layer.getSource()?.getFeatures()[0]
        if(!iconFeature) return
        iconFeature.setGeometry(new Point(fromLonLat([loc.lon, loc.lat])))

    }, [layer, loc])




    return null
}

export { TrackedEntity }