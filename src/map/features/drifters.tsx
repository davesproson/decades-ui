import { useContext, useEffect, useState } from "react"
import { PositionWithTime } from "../types"
import { VectorLayerContext } from "../layers/vector"
import Point from "ol/geom/Point"
import Feature from "ol/Feature"
import VectorSource from "ol/source/Vector"
import { fromLonLat } from "ol/proj"
import Style from "ol/style/Style"
import Fill from "ol/style/Fill"
import { getData } from "../../plot/plotUtils"
import RegularShape from "ol/style/RegularShape"
import { LineString } from "ol/geom"
import Stroke from "ol/style/Stroke"


const getAdvectedPoint = (origin: number[], distance: number, bearingd: number) => {
    const toRad = Math.PI / 180;
    const radius = 6371008.8;
    const bearing = bearingd * toRad;

    const phi1 = origin[1] * toRad;
    const lambda1 = origin[0] * toRad;
    const delta = distance / radius;

    const phi2 = Math.asin(
        Math.sin(phi1) * Math.cos(delta) +
        Math.cos(phi1) * Math.sin(delta) * Math.cos(bearing)
    );

    const lambda2 = lambda1 +
        Math.atan2(
            Math.sin(bearing) * Math.sin(delta) * Math.cos(phi1),
            Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2)
        );

    const lon = lambda2 / toRad;

    return [lon, phi2 / toRad];
};

const Drifter = ({ lon, lat, time }: PositionWithTime) => {
    const { layer } = useContext(VectorLayerContext)
    const drifterId = `drifter-${lon}-${lat}-${time}`
    // const [windSpeed, setWindSpeed] = useState<number | null>(null)
    // const [windDirection, setWindDirection] = useState<number | null>(null)
    const [wind, setWind] = useState<{ speed: number, direction: number } | null>(null)

    useEffect(() => {
        if (!layer) return
        let source = layer.getSource()
        if (!source) {
            source = new VectorSource()
            layer.setSource(source)
        }

        const iconFeature = new Feature({
            geometry: new Point(fromLonLat([lon, lat])),
            drifterId: `${drifterId}-icon`
        })
        const style = new Style({
            image: new RegularShape({
                points: 4,
                radius: 5,
                fill: new Fill({ color: 'black' }),
            }),
        })
        iconFeature.setStyle(style)
        source.addFeature(iconFeature)

        const lineFeature = new Feature({
            geometry: new LineString([fromLonLat([lon, lat]), fromLonLat([lon, lat])]),
            drifterId: `${drifterId}-line`
        })
        const lineStyle = new Style({
            stroke: new Stroke({
                color: 'black',
                width: 2,
                lineDash: [4, 4],
            }),
        })
        lineFeature.setStyle(lineStyle)
        source.addFeature(lineFeature)


        return () => {
            source?.removeFeature(iconFeature)
            source?.removeFeature(lineFeature)
        }

    }, [layer, lon, lat, time])

    useEffect(() => {
        if (!layer) return
        if (wind === null) {
            const now = Math.floor(new Date().getTime() / 1000)
            getData({
                params: ['adc_wind_speed', 'adc_wind_angle'],
            }, now - 1, now).then((data) => {
                const windspeed = data.adc_wind_speed[data.adc_wind_speed.length - 1]
                const windangle = data.adc_wind_angle[data.adc_wind_angle.length - 1]
                setWind({ speed: windspeed, direction: windangle })
            })
            return
        }
        const interval = setInterval(() => {
            const timeElapsed = new Date().getTime() - time
            const distance = wind.speed * (timeElapsed / 1000)
            const [newLon, newLat] = getAdvectedPoint([lon, lat], distance, 180+wind.direction)
            const source = layer.getSource()
            if (!source) return
            const iconFeature = source.getFeatures().find(
                (feature) => feature.getProperties().drifterId === `${drifterId}-icon`
            )
            iconFeature?.setGeometry(
                new Point(fromLonLat([newLon, newLat]))
            )

            const lineFeature = source.getFeatures().find(
                (feature) => feature.getProperties().drifterId === `${drifterId}-line`
            )
            lineFeature?.setGeometry(
                new LineString([fromLonLat([lon, lat]), fromLonLat([newLon, newLat])])
            )

        }, 1000)
        return () => clearInterval(interval)
    }, [layer, wind, lat, lon, time])

    return null
}

export { Drifter }