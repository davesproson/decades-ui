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
    color?: string,
    heading?: number,
}
type GeoJsonFeatureType = {
    type: "geojson"
    data?: any
}
type KMLFeatureType = {
    type: "kml",
    url: string
}
type ImageFeatureType = {
    type: "image",
    url: string
}
export type FeatureType = POIFeatureType | GeoJsonFeatureType | KMLFeatureType | ImageFeatureType

interface AbstractLayerType {
    type: string,
    name: string,
    color?: string,
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
interface KMLLayerType extends AbstractLayerType {
    type: 'kml',
    features: Array<KMLFeatureType>
}
export type LayerType = POILayerType | GeoJsonLayerType | KMLLayerType
export type FeatureTypeName = Pick<FeatureType, 'type'>['type']

export type MapFlag = {
    lat: number,
    lon: number,
    name: string,
}

export type DrawModeType = "Circle" | "LineString" | "Polygon" | null | DecadesMapModality.DELETE_DRAWING

export type DecadesMapState = {
    showHeaderBar: boolean,
    showLayersMenu: boolean,
    showToolbox: boolean,
    showGraticule: boolean,
    showWindVane: boolean,
    pinAircraft: boolean,
    layers: Array<LayerType>,
    flags: Array<MapFlag>,
    mapModes: Array<DecadesMapModality>
    overlay: MapFlag & {x: number, y: number} | null,
    aircraftMeasures: Array<PositionData>,
    measurements: Array<Array<Position>>,
    drawMode: DrawModeType,
    drifters: Array<PositionWithTime>
}

export type DecadesMapActions = {
    setShowHeaderBar: Dispatch<SetStateAction<boolean>>,
    setShowLayersMenu: Dispatch<SetStateAction<boolean>>,
    setLayers: Dispatch<SetStateAction<Array<LayerType>>>,
    setShowToolbox: Dispatch<SetStateAction<boolean>>,
    setShowGraticule: Dispatch<SetStateAction<boolean>>,
    setShowWindVane: Dispatch<SetStateAction<boolean>>,
    setFlags: Dispatch<SetStateAction<Array<MapFlag>>>,
    setPinAircraft: Dispatch<SetStateAction<boolean>>,
    toggleMapMode: (mode: DecadesMapModality) => void,
    setOverlay: Dispatch<SetStateAction<MapFlag & {x: number, y: number} | null>>,
    setAircraftMeasures: Dispatch<SetStateAction<Array<PositionData>>>,
    setMeasurements: Dispatch<SetStateAction<Array<Array<Position>>>>,
    setDrawMode: Dispatch<SetStateAction<DrawModeType>>
    setDrifters: Dispatch<SetStateAction<Array<PositionWithTime>>>
}

export enum DecadesMapModality {
    DEFAULT,
    DELETE_FLAG,
    ADD_AIRCRAFT_MEASURE,
    START_MEASUREMENT,
    DELETE_DRAWING
}

export interface Position {
    lat: number,
    lon: number,
}

export interface PositionWithTime extends Position {
    time: number,
}

export interface PositionData extends PositionWithTime {
    alt?: number,
    heading?: number,
    groundSpeed?: number,
}

export type PositionDataHistory = Array<PositionData>

export type AircraftData = {
    aircraftData: PositionData | null,
    aircraftHistory: PositionDataHistory,
}