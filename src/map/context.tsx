import { createContext } from 'react';
import { AircraftData, MapContextType } from './types';

export const MapContext = createContext<MapContextType>({
    state: {
        map: null,
    },
    actions: {
        setMap: () => { },
        addLayer: () => { },
    },
});

export const DataContext = createContext<AircraftData>({
    aircraftData: {
        lat: 0,
        lon: 0,
        time: 0,
    },
    aircraftHistory: [],
});