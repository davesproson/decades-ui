import { useContext, useEffect } from "react";
import { VectorLayerContext } from "../layers/vector";
import Feature from "ol/Feature";
import { LineString } from "ol/geom";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { badData } from "@/settings";

type TrackProps = {
    latitude: number[],
    longitude: number[],
    color?: string,
    width?: number
}

const filterBadData = (lat: number[], lon: number[]) => {
    const goodData: Array<Boolean> = [];
    for (let i = 0; i < lat.length; i++) {
        if (lat[i] !== badData && lon[i] !== badData) {
            goodData.push(true);
        } else {
            goodData.push(false);
        }
    }
    return {
        filteredLat: lat.filter((_, index) => goodData[index]),
        filteredLon: lon.filter((_, index) => goodData[index])
    }
}

const Track = (props: TrackProps) => {
    const { layer } = useContext(VectorLayerContext);

    useEffect(() => {
        if (!layer) return;
        console.log('Track: Initializing');
        layer.setZIndex(99);

        const { filteredLat, filteredLon } = filterBadData(props.latitude, props.longitude);

        const vectorSource = new VectorSource()
        layer.setSource(vectorSource);
        if (!vectorSource) {
            console.warn('Track: No vector source found on layer');
            return;
        }

        console.log('Track: Adding features');
        // Create a feature for the track
        const trackFeature = new Feature({
            geometry: new LineString(
                filteredLat.map((lat, index) => fromLonLat([filteredLon[index], lat]))
            ),
            name: 'Track'
        });

        const trackStyle = new Style({
            stroke: new Stroke({
                color: props.color || 'blue',
                width: props.width || 3
            })
        });
        trackFeature.setStyle(trackStyle);
        trackFeature.setStyle(trackStyle);
        vectorSource.addFeature(trackFeature);
        // Cleanup function to remove the feature when the component unmounts
        return () => {
            console.log('Track: Cleaning up');
            vectorSource.removeFeature(trackFeature);
        };
    }, [layer, props.latitude, props.longitude]);

    return null;
}

export { Track };