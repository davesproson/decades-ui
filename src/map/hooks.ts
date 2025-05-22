import { useRef, useEffect, useState } from "react";
import { Map as OlMap, View } from 'ol';
import { fromLonLat } from 'ol/proj.js';
import { defaults as controlDefaults } from 'ol/control/defaults';
import { getData } from "@/data/utils";
import { badData, mapLayerInterface } from "../settings";
import { DecadesMapActions, DecadesMapModality, DecadesMapState, DrawModeType, LayerType, MapFlag, Position, PositionData, PositionDataHistory, PositionWithTime } from "./types";
import { LAYER_INTERFACES } from "./layers/interface";

type OpenLayersMapArgs = {
    zoom?: number,
    center?: {
        lat: number,
        lon: number
    }
}

const useOpenLayersMap = ({ zoom, center }: OpenLayersMapArgs) => {
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
        if (!mapRef.current) {
            return
        }

        const olMap = new OlMap({
            view: new View({
                center: fromLonLat(center?.lon !== undefined ? [center.lon, center.lat] : [0, 0]),
                zoom: zoom
            }),
            controls: controlDefaults({
                attribution: false,
                zoom: false,
                rotate: false
            })

        })


        olMap.setTarget(mapRef.current)
        setMap(olMap)

        return () => {
            olMap.setTarget(undefined)
            actions.setMap(null)
        }
    }, [mapRef.current])

    return { mapRef, state, actions }
}

const useAircraftData = () => {
    const [aircraftData, setAircraftData] = useState<PositionData | null>(null);
    const [aircraftHistory, setAircraftHistory] = useState<PositionDataHistory>([]);

    const params = [
        "gin_latitude", "gin_longitude", "gin_altitude", "gin_heading",
        "gin_speed", "utc_time"
    ];

    const updateAircraft = async () => {
        const now = Math.floor(new Date().getTime() / 1000);
        let data = await getData({
            params: params
        }, now - 2, now - 1);

        let acData: PositionData;
        try {
            acData = {
                lat: data.gin_latitude[data.gin_latitude.length - 1],
                lon: data.gin_longitude[data.gin_longitude.length - 1],
                alt: data.gin_altitude[data.gin_altitude.length - 1],
                heading: data.gin_heading[data.gin_heading.length - 1],
                groundSpeed: data.gin_speed[data.gin_speed.length - 1],
                time: data.utc_time[data.utc_time.length - 1],
            };
        } catch (e) {
            console.error('Error updating aircraft data', e);
            return;
        }

        if (acData.lat === badData || acData.lon === badData) return;
        if (acData.lat === null || acData.lon === null) return;
        if (acData.lat === undefined || acData.lon === undefined) return;
        if (isNaN(acData.lat) || isNaN(acData.lon)) return;

        setAircraftData(acData);
        setAircraftHistory((oldState) => [...oldState, acData]);
    };

    const initAircraft = async (signal: AbortSignal) => {
        const now = Math.floor(new Date().getTime() / 1000);
        try {
            let data = await getData({
                params: params
            }, now - 3600 * 4, now - 1);

            if (signal.aborted) return; // Exit if the signal is aborted

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
                };
            }).filter((pos) => pos.lat !== badData && pos.lon !== badData)
                .filter((_pos, i) => i % 3 === 0);

            if (signal.aborted) return; // Exit if the signal is aborted

            setAircraftData(acData);
            setAircraftHistory(acHistory);
        } catch (e) {
            if (!signal.aborted) {
                console.error('Error initializing aircraft data', e);
            }
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        initAircraft(signal);

        const interval = setInterval(updateAircraft, 1000);

        return () => {
            controller.abort(); // Cancel any ongoing `initAircraft` call
            clearInterval(interval); // Clear the interval
        };
    }, []);

    return { aircraftData, aircraftHistory };
};

const useLayers = () => {
    const [layers, setLayers] = useState<Array<LayerType>>([])

    useEffect(() => {

        (async () => {
            setLayers(await LAYER_INTERFACES[mapLayerInterface]())
        })()

        const interval = setInterval(
            (async () => {
                const newLayers = await LAYER_INTERFACES[mapLayerInterface]()
                setLayers((oldLayers) => {
                    return newLayers.map((newLayer) => {
                        const oldLayer = oldLayers.find((l) => l.name === newLayer.name)
                        return {
                            ...newLayer,
                            visible: oldLayer?.visible || false
                        }
                    })
                })
            }), 60000)

        return () => clearInterval(interval)
    }, [])

    return [layers, setLayers]//layers
}

const useDecadesMapState = () => {
    const [showHeaderBar, setShowHeaderBar] = useState<boolean>(true)
    const [showLayersMenu, setShowLayersMenu] = useState<boolean>(false)
    const [showToolbox, setShowToolbox] = useState<boolean>(false)
    const [showGraticule, setShowGraticule] = useState<boolean>(false)
    const [layers, setLayers] = useLayers() //useState<Array<LayerType>>([])
    const [flags, setFlags] = useState([])
    const [overlay, setOverlay] = useState<MapFlag & { x: number, y: number } | null>(null)
    const [aircraftMeasures, setAircraftMeasures] = useState<PositionData[]>([])
    const [measurements, setMeasurements] = useState<Array<Position[]>>([])
    const [mapModes, setMapModes] = useState<Array<DecadesMapModality>>([])
    const [showWindVane, setShowWindVane] = useState<boolean>(false)
    const [pinAircraft, setPinAircraft] = useState<boolean>(true)
    const [drawMode, setDrawMode] = useState<DrawModeType>(null)
    const [drifters, setDrifters] = useState<Array<PositionWithTime>>([])

    const toggleMapMode = (mode: DecadesMapModality) => {
        setMapModes(x => {
            if (x.includes(mode)) {
                return x.filter(m => m !== mode)
            }
            return [...x, mode]
        })
    }

    return {
        state: {
            showHeaderBar,
            showLayersMenu,
            showToolbox,
            showGraticule,
            showWindVane,
            pinAircraft,
            layers,
            flags,
            mapModes,
            overlay,
            aircraftMeasures,
            measurements,
            drawMode,
            drifters
        } as DecadesMapState,
        actions: {
            setShowHeaderBar,
            setShowLayersMenu,
            setShowToolbox,
            setShowGraticule,
            setShowWindVane,
            setPinAircraft,
            setLayers,
            setFlags,
            toggleMapMode,
            setOverlay,
            setAircraftMeasures,
            setMeasurements,
            setDrawMode,
            setDrifters
        } as DecadesMapActions
    }
}

export { useOpenLayersMap, useAircraftData, useDecadesMapState }