import { createContext } from 'react';
import { MapContextType } from './types';

export const MapContext = createContext<MapContextType>({
    state: {
        map: null,
    },
    actions: {
        setMap: () => { },
        addLayer: () => { },
    },
});

export type PositionData = {
    lat: number,
    lon: number,
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

export const DataContext = createContext<AircraftData>({
    aircraftData: {
        lat: 0,
        lon: 0,
        time: 0,
    },
    aircraftHistory: [],
});