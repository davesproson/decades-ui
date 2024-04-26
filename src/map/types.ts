import { Map } from "ol";

export type MapContextType = {
    state: {
        map: Map | null;
    };
    actions: {
        setMap: (map: Map | null) => void;
        addLayer: () => void;
    };
};

type POIFeatureType = {
    type: "poi",
    latitude: number,
    longitude: number,
    color?: string
}
type GeoJsonFeatureType = {
    type: "geojson"
    data?: any
}
export type FeatureType = POIFeatureType | GeoJsonFeatureType

interface AbstractLayerType {
    type: string,
    name: string,
    visible: boolean
}

interface POILayerType extends AbstractLayerType {
    type: 'vector',
    features: Array<POIFeatureType>
}
interface GeoJsonLayerType extends AbstractLayerType {
    type: 'geojson',
    features: Array<GeoJsonFeatureType>
}
export type LayerType = POILayerType | GeoJsonLayerType
