import { useRef, useEffect, useState } from "react";
import { Map as OlMap, View } from 'ol';
import {fromLonLat} from 'ol/proj.js';
import { defaults as controlDefaults} from 'ol/control/defaults';
import { getData } from "../plot/plotUtils";
import { PositionData, PositionDataHistory } from "./context";
import { badData } from "../settings";
import { DecadesMapActions, DecadesMapModality, DecadesMapState, MapFlag } from "./types";

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

const useAircraftData = () => {
    const [aircraftData, setAircraftData] = useState<PositionData>({
        lat: 0,
        lon: 0,
        time: 0,
    })
    const [aircraftHistory, setAircraftHistory] = useState<PositionDataHistory>([])

    const params = [
        "gin_latitude", "gin_longitude", "gin_altitude", "gin_heading",
        "gin_speed", "utc_time"
    ]

    const updateAircraft = async () => {
        const now = Math.floor(new Date().getTime() / 1000);
        let data = await getData({
            params: params
        }, now - 2, now - 1);

        const acData = {
            lat: data.gin_latitude[data.gin_latitude.length - 1],
            lon: data.gin_longitude[data.gin_longitude.length - 1],
            alt: data.gin_altitude[data.gin_altitude.length - 1],
            heading: data.gin_heading[data.gin_heading.length - 1],
            groundSpeed: data.gin_speed[data.gin_speed.length - 1],
            time: data.utc_time[data.utc_time.length - 1],
        };

        if(acData.lat === badData || acData.lon === badData) return

        setAircraftData(acData)
        setAircraftHistory((oldState) => [...oldState, acData])

    }

    const initAircraft = async () => {
        const now = Math.floor(new Date().getTime() / 1000);
        let data = await getData({
            params: params
        }, now - 3600*4, now - 1);

        const acData = {
            lat: data.gin_latitude[data.gin_latitude.length - 1],
            lon: data.gin_longitude[data.gin_longitude.length - 1],
            alt: data.gin_altitude[data.gin_altitude.length - 1],
            heading: data.gin_heading[data.gin_heading.length - 1],
            groundSpeed: data.gin_speed[data.gin_speed.length - 1],
            time: data.utc_time[data.utc_time.length - 1],
        };

        const acHistory = data.gin_latitude.map((_, i) => {
            return {
                lat: data.gin_latitude[i],
                lon: data.gin_longitude[i],
                alt: data.gin_altitude[i],
                heading: data.gin_heading[i],
                groundSpeed: data.gin_speed[i],
                time: data.utc_time[i],
            }
        }).filter((pos) => pos.lat !== badData && pos.lon !== badData)
          .filter((_pos, i) => i % 3 === 0)

        setAircraftData(acData)
        setAircraftHistory(acHistory)
    }

    useEffect(() => {
        initAircraft()
        const interval = setInterval(() => {
            updateAircraft()
        }, 3000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return { aircraftData, aircraftHistory }
}


const useDecadesMapState = () => {
    const [showHeader, setShowHeader] = useState<boolean>(true)
    const [showLayersMenu, setShowLayersMenu] = useState<boolean>(true)
    const [showToolbox, setShowToolbox] = useState<boolean>(true)
    const [layers, setLayers] = useState([])
    const [flags, setFlags] = useState([])
    const [overlay, setOverlay] = useState<MapFlag & {x: number, y: number} | null>(null)

    const [mapModes, setMapModes] = useState<Array<DecadesMapModality>>([])

    const toggleMapMode = (mode: DecadesMapModality) => {
        setMapModes(x=>{
            if(x.includes(mode)) {
                return x.filter(m=>m !== mode)
            }
            return [...x, mode]
        })
    }
       

    return {
        state: {
            showHeader,
            showLayersMenu,
            showToolbox,
            layers,
            flags,
            mapModes,
            overlay
        } as DecadesMapState,
        actions: {
            setShowHeader,
            setShowLayersMenu,
            setLayers,
            setShowToolbox,
            setFlags,
            toggleMapMode,
            setOverlay
        } as DecadesMapActions
    }
}

export { useOpenLayersMap, useAircraftData, useDecadesMapState}