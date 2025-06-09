import { useContext, useEffect } from "react";
import { VectorLayerContext } from "../layers/vector";
import Feature from "ol/Feature";
import { LineString } from "ol/geom";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { badData } from "@/settings";
import { colourMaps } from "@/utils";

type TrackProps = {
    latitude: number[],
    longitude: number[],
    data: (number | undefined)[],
    color?: string,
    colorMap?: string,
    width?: number
}


const ReliefTrack = (props: TrackProps) => {
    const ColorMap = (data: number[], value: number): string => {
        const min = Math.min(...data.filter((v) => v !== badData));
        const max = Math.max(...data.filter((v) => v !== badData));
        // Viridis color map
        const normalized = (value - min) / (max - min);
        const [r, g, b] = colourMaps.interpolate(colourMaps.maps[props.colorMap || "viridis"] || colourMaps.maps.viridis, normalized);
        // Convert to 0-255 range
        const r255 = Math.floor(r * 255);
        const g255 = Math.floor(g * 255);
        const b255 = Math.floor(b * 255);
        const a = value === badData ? 0 : 1; // Set alpha to 0 if value is badData
        return `rgba(${r255}, ${g255}, ${b255}, ${a})`;
    };

    const { layer } = useContext(VectorLayerContext);

    useEffect(() => {
        if (!layer) return;
        console.log('ReliefTrack: Initializing');
        console.log('ReliefTrack: lengths', props.latitude.length, props.longitude.length, props.data.length);

        const goodData: Array<Boolean> = []
        for (let i = 0; i < props.data.length; i++) {
            if (props.data[i] !== badData && props.latitude[i] !== badData && props.longitude[i] !== badData) {
                goodData.push(true)
            } else {
                goodData.push(false)
            }
        }

        let downSampledData = props.data.filter((_, i) => goodData[i])
        let downSampledLatitude = props.latitude.filter((_, i) => goodData[i])
        let downSampledLongitude = props.longitude.filter((_, i) => goodData[i])

        downSampledLatitude = downSampledLatitude.filter((_, index) => index % 3 === 0) || []
        downSampledLongitude = downSampledLongitude.filter((_, index) => index % 3 === 0) || []
        downSampledData = downSampledData.filter((_, index) => index % 3 === 0) || []

        layer.setZIndex(99);

        const vectorSource = new VectorSource()
        layer.setSource(vectorSource);
        if (!vectorSource) {
            console.warn('Track: No vector source found on layer');
            return;
        }

        console.log('ReliefTrack: Adding features');
        // Create a feature for the track
        const trackFeature = new Feature({
            geometry: new LineString(
                // props.latitude.map((lat, index) => fromLonLat([props.longitude[index], lat, props.data[index] || 0]))
                downSampledLatitude.map((lat, index) => [...fromLonLat([downSampledLongitude[index], lat])]
                )),
            name: 'Track'
        });

        const trackStyle = function (feature: any) {
            const lineString = feature.getGeometry();
            const styles = [];
            const coordinates = lineString.getCoordinates();
            for (let i = 0; i < coordinates.length - 1; i++) {
                let color;
                if (downSampledData[i] !== undefined) {
                    color = ColorMap(downSampledData.filter((value) => value !== undefined), downSampledData[i] || 0);
                } else {
                    color = props.color || 'blue';
                }
                styles.push(
                    new Style({
                        geometry: new LineString(coordinates.slice(i, i + 2)),
                        stroke: new Stroke({
                            color: color,
                            width: 6
                        })
                    })
                );
            }

            return styles;
        }
        vectorSource.addFeature(trackFeature);
        trackFeature.setStyle(trackStyle);
        // Cleanup function to remove the feature when the component unmounts
        return () => {
            console.log('Track: Cleaning up');
            vectorSource.removeFeature(trackFeature);
        };
    }, [layer, props.latitude, props.longitude, props.data, props.colorMap]);

    return null;
}

export { ReliefTrack };