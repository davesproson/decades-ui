import { useRef, useEffect, useState } from "react";
import { Map as OlMap, View } from 'ol';
import { fromLonLat } from 'ol/proj.js';
import { defaults as controlDefaults } from 'ol/control/defaults';
import { getData } from "@/data/utils";
import { badData, geoCoordsQuicklook, mapLayerInterface } from "../settings";
import { DecadesMapActions, DecadesMapModality, DecadesMapState, DrawModeType, LayerType, MapFlag, Position, PositionData, PositionDataHistory, PositionWithTime } from "./types";
import { LAYER_INTERFACES } from "./layers/interface";
import { useLocalStorage } from "usehooks-ts";
import { useSelector } from "@/redux/store";

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


const PARAMS = [
    "gin_latitude", "gin_longitude", "gin_altitude", "gin_heading",
    "gin_speed", "utc_time"
];

const initAircraftLive = async (signal: AbortSignal, setAircraftData: (data: PositionData) => void, setAircraftHistory: (data: PositionDataHistory) => void) => {
    const now = Math.floor(new Date().getTime() / 1000);
    try {
        let data = await getData({
            params: PARAMS
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

const useAircraftData = () => {
    const [aircraftData, setAircraftData] = useState<PositionData | null>(null);
    const [aircraftHistory, setAircraftHistory] = useState<PositionDataHistory>([]);
    const [noDataReturned, setNoDataReturned] = useState<boolean>(false);
    const quickLookMode = useSelector((state) => state.config.quickLookMode);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        if (quickLookMode) {
            return () => {
                controller.abort(); // Cancel any ongoing `initAircraft` call
            };
        }

        initAircraftLive(signal, setAircraftData, setAircraftHistory);

        return () => {
            controller.abort(); // Cancel any ongoing `initAircraft` call
        };
    }, [quickLookMode]);

    useEffect(() => {
        if (quickLookMode) return;

        const timeout = setTimeout(async () => {
            if (!aircraftData?.time) return;

            const startTime = aircraftData.time + 1;
            const now = Math.max(
                Math.floor(new Date().getTime() / 1000) - 1,
                startTime
            );

            const data = await getData({
                params: PARAMS,
            }, startTime, now)

            if (data.gin_latitude.length === 0) {
                setNoDataReturned(x => !x);
                return; // No new data to process
            }

            const history = data.gin_latitude.map((_, i) => {
                return {
                    lat: data.gin_latitude[i],
                    lon: data.gin_longitude[i],
                    alt: data.gin_altitude[i],
                    heading: data.gin_heading[i],
                    groundSpeed: data.gin_speed[i],
                    time: data.utc_time[i],
                };
            }).filter((pos) => pos.lat !== badData && pos.lon !== badData)

            if (history.length === 0) {
                setNoDataReturned(x => !x);
                return; // No valid data to process
            }

            setAircraftHistory((state) => [...state, ...history]);
            setAircraftData({
                lat: history[history.length - 1].lat,
                lon: history[history.length - 1].lon,
                alt: history[history.length - 1].alt,
                heading: history[history.length - 1].heading,
                groundSpeed: history[history.length - 1].groundSpeed,
                time: history[history.length - 1].time,
            });

        }, 1000)

        return () => {
            clearTimeout(timeout);
        };

    }, [quickLookMode, aircraftData, noDataReturned, setAircraftData, setAircraftHistory]);

    return { aircraftData, aircraftHistory };
};

const useQuickLookAircraftData = () => {
    const quickLookMode = useSelector((state) => state.config.quickLookMode)
    const params = useSelector((state) => state.vars.params)
    const timeframe = useSelector((state) => state.options.customTimeframe)
    const [visData, setVisData] = useState<number[]>([])
    const [latData, setLatData] = useState<number[]>([])
    const [lonData, setLonData] = useState<number[]>([])

    useEffect(() => {
        if (!quickLookMode || !params) {
            return
        }

        (async () => {
            let selectedParam = params?.find(x => x.selected)
            const getParams = [
                geoCoordsQuicklook.latitude,
                geoCoordsQuicklook.longitude,
            ]
            if (selectedParam) {
                getParams.push(selectedParam.raw)
            }

            const data = await getData({ params: getParams }, Math.floor((timeframe.start || 0) / 1000), Math.floor((timeframe.end || 9e9) / 1000))
            if (selectedParam) {
                setVisData(data[selectedParam.raw])
            }
            setLatData(data[geoCoordsQuicklook.latitude])
            setLonData(data[geoCoordsQuicklook.longitude])
        })()

    }, [params, setVisData, setLatData, setLonData, quickLookMode])

    return { visData, latData, lonData }
}

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
    const [showGraticule, setShowGraticule] = useLocalStorage<boolean>('decades-map-graticule', false)
    const [layers, setLayers] = useLayers() //useState<Array<LayerType>>([])
    const [flags, setFlags] = useLocalStorage('decades-map-flags', [])
    const [overlay, setOverlay] = useLocalStorage<MapFlag & { x: number, y: number } | null>('decades-map-overlay', null)
    const [aircraftMeasures, setAircraftMeasures] = useLocalStorage<PositionData[]>('decades-map-aircraft-measures', [])
    const [measurements, setMeasurements] = useLocalStorage<Array<Position[]>>('decades-map-measurements', [])
    const [mapModes, setMapModes] = useState<Array<DecadesMapModality>>([])
    const [showWindVane, setShowWindVane] = useLocalStorage<boolean>('decades-map-windvane', false)
    const [pinAircraft, setPinAircraft] = useState<boolean>(true)
    const [drawMode, setDrawMode] = useState<DrawModeType>(null)
    const [drifters, setDrifters] = useLocalStorage<Array<PositionWithTime>>('decades-map-drifters', [])

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

export { useOpenLayersMap, useAircraftData, useDecadesMapState, useQuickLookAircraftData }