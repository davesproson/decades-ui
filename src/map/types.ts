import { Map } from "ol";
import { Dispatch, SetStateAction } from "react";

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

export type MapFlag = {
    lat: number,
    lon: number,
    name: string,
}

export type DecadesMapState = {
    showHeaderBar: boolean,
    showLayersMenu: boolean,
    showToolbox: boolean,
    showGraticule: boolean,
    layers: Array<LayerType>,
    flags: Array<MapFlag>,
    mapModes: Array<DecadesMapModality>
    overlay: MapFlag & {x: number, y: number} | null,
    aircraftMeasures: Array<PositionData>,
    measurements: Array<Array<Position>>,
}

export type DecadesMapActions = {
    setShowHeaderBar: Dispatch<SetStateAction<boolean>>,
    setShowLayersMenu: Dispatch<SetStateAction<boolean>>,
    setLayers: Dispatch<SetStateAction<Array<LayerType>>>,
    setShowToolbox: Dispatch<SetStateAction<boolean>>,
    setShowGraticule: Dispatch<SetStateAction<boolean>>,
    setFlags: Dispatch<SetStateAction<Array<MapFlag>>>,
    toggleMapMode: (mode: DecadesMapModality) => void,
    setOverlay: Dispatch<SetStateAction<MapFlag & {x: number, y: number} | null>>,
    setAircraftMeasures: Dispatch<SetStateAction<Array<PositionData>>>,
    setMeasurements: Dispatch<SetStateAction<Array<Array<Position>>>>
}

export enum DecadesMapModality {
    DEFAULT,
    DELETE_FLAG,
    ADD_AIRCRAFT_MEASURE,
    START_MEASUREMENT,
}

export interface Position {
    lat: number,
    lon: number,
}

export interface PositionData extends Position {
    time: number,
    alt?: number,
    heading?: number,
    groundSpeed?: number,
}

export type PositionDataHistory = Array<PositionData>

export type AircraftData = {
    aircraftData: PositionData,
    aircraftHistory: PositionDataHistory,
}