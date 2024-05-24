import { useContext, useEffect } from 'react'
import { MapContext } from './context'
import { toLonLat } from 'ol/proj'
import type { DecadesMapActions, DecadesMapState } from './types'
import { DecadesMapModality } from './types'
import SimpleGeometry from 'ol/geom/SimpleGeometry'

type DecadesProps = {
    state: DecadesMapState,
    actions: DecadesMapActions
}

const MapClickEvent = ({ state, actions }: DecadesProps) => {
    const { state: mapState } = useContext(MapContext)

    // Remove a flag when it is clicked, if the delete flag mode is active
    useEffect(() => {
        if (!mapState.map) return
        if (!(state.mapModes.includes(DecadesMapModality.DELETE_FLAG))) return

        const removeFlag = (e: any) => {
            if (!mapState.map) return

            const pixel = mapState.map.getEventPixel(e.originalEvent)
            mapState.map.forEachFeatureAtPixel(pixel, feature => {

                actions.setFlags(state.flags.filter(flag => {
                    return flag.name !== feature.get('name')
                }))
            })
            actions.toggleMapMode(DecadesMapModality.DELETE_FLAG)
        }

        mapState.map.on('click', removeFlag)

        return () => {
            mapState.map?.un('click', removeFlag)
        }
    }, [mapState.map, state.flags, state.mapModes])

    // Add a measurement from the aircraft to the clicked location
    // if the add aircraft measure mode is active
    useEffect(() => {
        if (!mapState.map) return
        if (!state.mapModes.includes(DecadesMapModality.ADD_AIRCRAFT_MEASURE)) return

        const addAircraftMeasurement = (e: any) => {
            if (!mapState.map) return
            const pixel = mapState.map.getEventPixel(e.originalEvent)
            const lonLat = toLonLat(mapState.map.getCoordinateFromPixel(pixel))
            actions.setAircraftMeasures(x => [...x, {
                lat: lonLat[1],
                lon: lonLat[0],
                time: 0
            }])
        }

        mapState.map.on('click', addAircraftMeasurement)
        return () => {
            mapState.map?.un('click', addAircraftMeasurement)
        }
    }, [mapState.map, state.mapModes, actions.setAircraftMeasures])

    // Add a measurement line to the map if the start measurement mode is active
    // useEffect(() => {
    //     if (!mapState.map) return
    //     if (!state.mapModes.includes(DecadesMapModality.START_MEASUREMENT)) return

    //     const startMeasurement = (e: any) => {
    //         if (!mapState.map) return
    //         const pixel = mapState.map.getEventPixel(e.originalEvent)
    //         const lonLat = toLonLat(mapState.map.getCoordinateFromPixel(pixel))
            
    //         const interaction = new Draw({
    //             source: new VectorSource(),
    //             type: 'LineString'
    //         })
    //     }

    //     mapState.map.on('click', startMeasurement)
    //     return () => {
    //         mapState.map?.un('click', startMeasurement)
    //     }
    // }, [mapState.map, state.mapModes, actions.setAircraftMeasures])
    

    return null
}

const MouseMoveEvent = ({ actions }: DecadesProps) => {
    const { state: mapState } = useContext(MapContext)

    useEffect(() => {
        if (!mapState.map) return
        const updateCoords = (e: any) => {
            if (!mapState.map) return
            const pixel = mapState.map.getEventPixel(e.originalEvent)
            if (!mapState.map.getFeaturesAtPixel(pixel).length) {
                actions.setOverlay(null)
                return
            }
            mapState.map.forEachFeatureAtPixel(pixel, feature => {
                if (feature.get('type') === 'poi') {
                    const geometry = feature.getGeometry()
                    if (!geometry) return
                    const coords = (geometry as SimpleGeometry).getCoordinates()
                    if (!coords) return
                    const lonLat = toLonLat(coords)

                    const [x, y] = pixel

                    actions.setOverlay({
                        lon: lonLat[0],
                        lat: lonLat[1],
                        name: feature.get('name'),
                        x: x,
                        y: y
                    })
                } else {
                    actions.setOverlay(null)
                }
            })
        }

        mapState.map.on('pointermove', updateCoords)

        return () => {
            mapState.map?.un('pointermove', updateCoords)
        }
    }, [mapState.map])

    return null
}

export { MapClickEvent, MouseMoveEvent }