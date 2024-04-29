import OpenLayersMap from './map';

import { DataContext, MapContext } from './context';
import { useAircraftData, useDecadesMapState } from './hooks';
import { MapHeader } from './header';
import { BaseLayer } from './layers/base';
import { TrackedEntity } from './features/trackedEntity';
import { useScrollInhibitor } from '../hooks';
import { VectorLayer } from './layers/vector';
import { POI } from './features/poi';
import { Toolbar } from './controls';
import { Toolbox } from './toolbox';
import { LayersMenu } from './layersMenu';
import { GeoJson } from './features/geojson';
import { DecadesMapActions, DecadesMapModality, DecadesMapState, FeatureType, MapFlag } from './types';
import { useContext, useEffect } from 'react';
import { toLonLat } from 'ol/proj';
import { SimpleGeometry } from 'ol/geom';
import { ddToDmm } from '../utils';

const LayerHash = {
    'vector': VectorLayer,
    'geojson': VectorLayer
}

function getFeatureType(feature: FeatureType): React.FC<any> {
    switch (feature.type) {
        case 'poi':
            return POI
        case 'geojson':
            return GeoJson
        default:
            throw new Error('Unknown feature type')
    }
}


type DecadesProps = {
    state: DecadesMapState,
    actions: DecadesMapActions
}
const MapClickEvent = ({ state, actions }: DecadesProps) => {
    const { state: mapState } = useContext(MapContext)

    useEffect(() => {
        if (!mapState.map) return

        const removeFlag = (e: any) => {
            if (!mapState.map) return
            if (!(state.mapModes.includes(DecadesMapModality.DELETE_FLAG))) return
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
    }, [mapState.map, state.mapModes, state.flags])
    return null
}

const MouseMoveEvent = ({ state, actions }: DecadesProps) => {
    const { state: mapState } = useContext(MapContext)
    state
    actions

    useEffect(() => {
        if (!mapState.map) return

        const updateCoords = (e: any) => {
            if(!mapState.map) return
            const pixel = mapState.map.getEventPixel(e.originalEvent)
            if(!mapState.map.getFeaturesAtPixel(pixel).length){
                actions.setOverlay(null)
                return
            }
            mapState.map.forEachFeatureAtPixel(pixel, feature => {
                if(feature.get('type') === 'poi') {
                    const geometry = feature.getGeometry()
                    if(!geometry) return
                    const coords = (geometry as SimpleGeometry).getCoordinates()
                    if(!coords) return
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

const POIOverlay = (props: MapFlag & {x: number, y: number} | null) => {

    if (!props) return null

    const latInfo = ddToDmm(props.lat, ['N', 'S'])
    const lonInfo = ddToDmm(props.lon, ['E', 'W'])

    return (
        <div className="has-background-light p-2" style={{
            zIndex: 999, position: "fixed", top: props.y, left: props.x,
            pointerEvents: "none", borderRadius: "5px", transform: "translate(-50%, -110%)"
        }}>
            <h2 className="title is-5">{props.name}</h2>
            <p>Lat: {`${latInfo.coord} °${latInfo.hemisphere}`}</p>
            <p>Lon: {`${lonInfo.coord} °${lonInfo.hemisphere}`}</p>
        </div>
    )
}

const DecadesMap = () => {
    const { aircraftData, aircraftHistory } = useAircraftData()
    const { state, actions } = useDecadesMapState()

    useScrollInhibitor(true)


    const toggleLayerVisibility = (name: string) => {
        actions.setLayers(state.layers.map(layer => {
            if (layer.name === name) {
                return {
                    ...layer,
                    visible: !layer.visible
                }
            }
            return layer
        }))
    }

    return (
        <OpenLayersMap>
            <DataContext.Provider value={{ aircraftData, aircraftHistory }}>

                <MapHeader show={state.showHeader} />
                <BaseLayer />

                <MapClickEvent state={state} actions={actions} />
                <MouseMoveEvent state={state} actions={actions} />

                {state.overlay && <POIOverlay {...state.overlay} />}

                <TrackedEntity
                    icon={{
                        src: 'mapicons/g-luxe.png',
                        scale: 0.5,
                    }}
                    name='G-LUXE'
                />

                {state.layers.map((layer, i) => {
                    if (!layer.visible) return null
                    const Layer = LayerHash[layer.type]
                    return (
                        <Layer key={i}>
                            {layer.features.map((feature, j) => {
                                const Feature = getFeatureType(feature)
                                return <Feature key={j} {...feature} />
                            })}
                        </Layer>
                    )
                })}

                <VectorLayer>
                    {state.flags.map((flag) => (
                        <POI key={flag.name}
                            latitude={flag.lat}
                            longitude={flag.lon}
                            name={flag.name}
                            icon={{
                                src: 'mapicons/flag-marker.png',
                                scale: 0.15,
                            }}
                        />
                    ))}
                </VectorLayer>

                <Toolbox show={state.showToolbox} actions={actions} state={state} />
            </DataContext.Provider>
            <Toolbar state={state} actions={actions} />
            <LayersMenu show={state.showLayersMenu} layers={state.layers} toggleLayerVisibility={toggleLayerVisibility} />
        </OpenLayersMap>
    )
}

export default DecadesMap;