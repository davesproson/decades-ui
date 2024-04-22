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