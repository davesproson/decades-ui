import { useRef, useEffect, useState } from "react";
import { Map as OlMap, View } from 'ol';
import {fromLonLat} from 'ol/proj.js';
import { defaults as controlDefaults} from 'ol/control/defaults';

const useOpenLayersMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<OlMap | null>(null);
    const state = {
        map: map,
    };

    const actions = {
        setMap: setMap,
        addLayer: () => { },
    };

    useEffect(() => {
        if(!mapRef.current) {
            return
        }

        const olMap = new OlMap({
            view: new View({
                center: fromLonLat([0, 52]),
                zoom: 6
            }),
            controls: controlDefaults({
                attribution: false,
                zoom: false,
                rotate: false
            }),
        })

        olMap.setTarget(mapRef.current)
        setMap(olMap)

        return () => {
            olMap.setTarget(undefined)
            actions.setMap(null)
        }
	}, [mapRef.current])

    return {mapRef, state, actions}
}

export { useOpenLayersMap }