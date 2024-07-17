import { useContext, useEffect, useState } from "react"
import { VectorLayerContext } from "../layers/vector"
import RegularShape from "ol/style/RegularShape"
import Stroke from "ol/style/Stroke"
import Fill from "ol/style/Fill"
import { fromLonLat } from "ol/proj"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import Style from "ol/style/Style"
import { DataContext } from "../context"
import { getData } from "@/data/utils"
import { badData } from "@/settings"

const WindVane = () => {
    const { layer } = useContext(VectorLayerContext)
    const { aircraftData } = useContext(DataContext)
    const [windDir, setWindDir] = useState<number|null>(null)

    useEffect(() => {
        const update = () => {
            const now = Math.floor(new Date().getTime() / 1000)
            const then = now - 1
            getData({
                params: ['adc_wind_angle'],
            }, then, now).then((data) => {
                const newWindDir = data.adc_wind_angle[data.adc_wind_angle.length - 1]
                if (newWindDir === badData || newWindDir === null || newWindDir === undefined) return
                setWindDir(newWindDir)
            })
        }
        update()
        const interval = setInterval(update, 3000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!layer) return
        if (windDir === badData) return
        layer.setZIndex(100)

        const shaft = new RegularShape({
            points: 2,
            radius: 5,
            stroke: new Stroke({
                width: 2,
                color: 'red',
            }),
            rotateWithView: true,
        });

        const head = new RegularShape({
            points: 3,
            radius: 5,
            fill: new Fill({
                color: 'red',
            }),
            rotateWithView: true,
        });

        const feature = new Feature({
            geometry: new Point(fromLonLat([0, -99])),
        });
        const styles = [
            new Style({ image: shaft }),
            new Style({ image: head }),
        ]

        const angle = 0
        const scale = 3
        shaft.setScale([1, scale]);
        shaft.setRotation(angle);
        shaft.setDisplacement([0, 15])
        head.setDisplacement([
            0,
            head.getRadius() / 2 + shaft.getRadius() * scale + 15,
        ]);
        head.setRotation(angle);

        feature.setStyle(styles);

        layer.getSource()?.addFeature(feature)
        

        return () => {
            layer.getSource()?.clear()
        }
    }, [layer])

    useEffect(() => {
        if (!layer) return
        if (!aircraftData) return
        if (windDir === null || windDir === badData) return

        const features = layer.getSource()?.getFeatures()
        if (!features) return

        const feature = features[0]
        feature.setGeometry(
            new Point(fromLonLat([aircraftData.lon, aircraftData.lat]))
        )

        if (windDir === badData) return

        const styles = feature.getStyle()

        if (!styles) return
        if (styles instanceof Array) {
            const shaft = styles[0].getImage() as RegularShape
            const head = styles[1].getImage() as RegularShape
            const angle = windDir * (Math.PI / 180)
            shaft.setRotation(angle)
            head.setRotation(angle)
        } else {
            console.warn('Unexpected style type for wind vane')
        }
    }, [aircraftData])

    return null
}

export { WindVane }