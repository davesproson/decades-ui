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

    // Add a flag when the add flag mode is active
    useEffect(() => {
        if (!mapState.map) return
        if (!state.mapModes.includes(DecadesMapModality.ADD_FLAG)) return

        const addFlag = (e: any) => {
            if (!mapState.map) return
            const pixel = mapState.map.getEventPixel(e.originalEvent)
            const lonLat = toLonLat(mapState.map.getCoordinateFromPixel(pixel))
            const lastFlag = state.flags[state.flags.length - 1]
            let numFlags: number
            if (!lastFlag?.name) {
                numFlags = 0
            } else {
                numFlags = parseInt(lastFlag.name.split(' ')[1])
            }
            const newFlag = {
                lat: lonLat[1],
                lon: lonLat[0],
                name: `Flag ${numFlags + 1}`
            }
            actions.setFlags(x => [...x, newFlag])
        }

        mapState.map.on('click', addFlag)

        return () => {
            mapState.map?.un('click', addFlag)
        }

    }, [mapState.map, state.flags, state.mapModes, actions.setFlags])

    return null
}

const MouseMoveEvent = ({ state, actions }: DecadesProps) => {
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


    // Show and update the mouse position overlay when the add flag mode is active
    // This is useful for adding flags at a specific location when the coordinates are not known
    useEffect(() => {
        // If the map is not available or the add flag mode is not active, do nothing
        if (!mapState.map) return
        if (!state.mapModes.includes(DecadesMapModality.ADD_FLAG)) return

        // Update the overlay with the mouse position
        const updateCoords = (e: any) => {
            if (!mapState.map) return

            // Get the current mouse position in pixel coordinates
            // and convert it to longitude and latitude
            const mousePos = mapState.map.getEventPixel(e.originalEvent)
            const lonLat = toLonLat(mapState.map.getCoordinateFromPixel(mousePos))

            // Set the overlay with the current mouse position
            actions.setOverlay({
                lon: lonLat[0],
                lat: lonLat[1],
                name: 'Mouse Position',
                x: mousePos[0],
                y: mousePos[1]
            })
        }

        // Add the pointermove event listener to the map
        mapState.map.on('pointermove', updateCoords)

        // Cleanup function to remove the event listener and reset the overlay
        // when the component is unmounted or the map or actions change
        return () => {
            actions.setOverlay(null)
            mapState.map?.un('pointermove', updateCoords)
        }
    }, [mapState.map, actions.setOverlay, state.mapModes])

    return null
}

export { MapClickEvent, MouseMoveEvent }