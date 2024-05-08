import OpenLayersMap from './map';

import { DataContext } from './context';
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
import { DecadesMapModality, FeatureType, MapFlag, Position } from './types';
import { ddToDmm } from '../utils';
import { AircraftMeasurement } from './features/aircraftMeasurement';
import { LineMeasurement, LineMeasurementInteraction } from './features/lineMeasurement';
import { MapClickEvent, MouseMoveEvent } from './events';
import { Graticule } from './layers/graticule';

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


const POIOverlay = (props: MapFlag & { x: number, y: number } | null) => {

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
        <DataContext.Provider value={{ aircraftData, aircraftHistory }}>
            <MapHeader show={state.showHeaderBar} />
            <OpenLayersMap>

                <BaseLayer />
                {state.showGraticule && <Graticule />}

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

                <VectorLayer>
                    {state.aircraftMeasures.map((flag, i) => (
                        <AircraftMeasurement key={i}
                            lat={flag.lat}
                            lon={flag.lon}
                        />
                    ))}
                </VectorLayer>

                <VectorLayer>
                    <LineMeasurementInteraction
                        active={state.mapModes.includes(DecadesMapModality.START_MEASUREMENT)}
                        addMeasurement={(startPos: Position, endPos: Position) => actions.setMeasurements([...state.measurements, [startPos, endPos]])}
                    />

                    {state.measurements.map((measurement, i) => (
                        <LineMeasurement key={i}
                            startPos={measurement[0]}
                            endPos={measurement[1]}
                        />
                    ))}

                </VectorLayer>

                <Toolbar state={state} actions={actions} />
                <Toolbox show={state.showToolbox} actions={actions} state={state} />

                <LayersMenu show={state.showLayersMenu} layers={state.layers} toggleLayerVisibility={toggleLayerVisibility} />
            </OpenLayersMap>
        </DataContext.Provider>
    )
}

export default DecadesMap;