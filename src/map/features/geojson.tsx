import GeoJSON from 'ol/format/GeoJSON'
import { useContext, useEffect } from 'react'
import { VectorLayerContext } from '../layers/vector'
import Fill from 'ol/style/Fill'
// import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'

const colorInterpolant = (value: number, min: number, max: number) => {
    const percent = (value - min) / (max - min)
    const red = percent * 255
    const green = (1 - percent) * 255
    // const blue = (1 - percent) * 255
    return `rgba(${red}, ${green}, 0, 0.6)`
}

const extractLevel = (feature: any) => {
    return feature.getProperties().level.split('_')[0]
}

type GeoJsonProps = {
    data: any
}
const GeoJson = (props: GeoJsonProps) => {
    const { layer } = useContext(VectorLayerContext)

    useEffect(() => {
        if ( !layer) return

        const geojson = new GeoJSON({
            featureProjection: 'EPSG:3857',
        })

        const features = geojson.readFeatures(props.data)

        features.forEach((feature) => {
            feature.setStyle(new Style({
                fill: new Fill({
                    color: colorInterpolant(parseInt(extractLevel(feature)), 0, 10),
                }),
                // stroke: new Stroke({
                //     color: '#319FD3',
                //     width: 1,
                // }),
            }))
        })

        layer.getSource()?.addFeatures(features)

        return () => {
            layer.getSource()?.clear()
        }
    }, [layer])

    return null
}

export { GeoJson }