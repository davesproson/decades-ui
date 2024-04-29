import { useContext, useEffect } from 'react';
import { VectorLayerContext } from '../layers/vector';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon, { IconAnchorUnits } from 'ol/style/Icon';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';

type POIProps = {
    icon?: {
        src: string,
        scale?: number,
        anchor?: number[],
        anchorXUnits?: IconAnchorUnits | undefined
        anchorYUnits?: IconAnchorUnits | undefined
    },
    name?: string,
    color?: string,
    latitude: number,
    longitude: number,
}

const POI = (props: POIProps) => {
    const { layer } = useContext(VectorLayerContext)

    useEffect(() => {
        if (!layer) return

        const style = new Style()

        if(props.icon) {
            style.setImage(new Icon({
                src: props.icon.src,
                scale: props.icon.scale || 1,
                anchor: props.icon.anchor || [0.5, 1],
                anchorXUnits: props.icon.anchorXUnits || "fraction",
                anchorYUnits: props.icon.anchorYUnits || "fraction",
            }))
        } else {
            style.setImage(new Circle({
                radius: 7,
                stroke: new Stroke({
                    color: "#000000",
                    width: 2,
                }),
                fill: new Fill({
                    color: props.color || "#ff0000",
                }),
        }))
        }

        const feature = new Feature({
            geometry: new Point(fromLonLat([props.longitude, props.latitude])),
            name: props.name || "POI",
            type: "poi"
        })

        feature.setStyle(style)


        layer.getSource()?.addFeature(feature)

        return () => {
            layer.getSource()?.removeFeature(feature)
        }
        
    }, [layer])

    return null
}

export { POI }