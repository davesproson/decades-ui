import OpenLayersMap from './map';

import { DataContext } from './context';
import { useAircraftData, useDecadesMapState, useQuickLookAircraftData } from './hooks';
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
import { DecadesMapModality, FeatureType, LayerType, MapFlag, Position } from './types';
import { ddToDmm } from '../utils';
import { AircraftMeasurement } from './features/aircraftMeasurement';
import { LineMeasurement, LineMeasurementInteraction } from './features/lineMeasurement';
import { MapClickEvent, MouseMoveEvent } from './events';
import { Graticule } from './layers/graticule';
import { WindVane } from './features/windVane';
import { MapCenter } from './utils/mapCenter';
import { Drawings } from './features/drawings';
import { Drifter } from './features/drifters';
import { LiveDataOnly, QuicklookOnly, Show } from '../components/flow';
import { Optional } from '../types';
import { badData } from '../settings';

import entityIcon from '@/assets/map-icons/g-luxe.png';
import markerIcon from '@/assets/map-icons/flag-marker.png';
import { KMLFeature } from './features/kml';
import { Track } from './features/track';
import { ReliefTrack } from './features/reliefTrack';
import ColourBar from './colourbar';
import { useState } from 'react';

const LayerHash = {
    'vector': VectorLayer,
    'geojson': VectorLayer,
    'kml': VectorLayer,
}

function getFeatureType(feature: FeatureType): React.FC<any> {
    switch (feature.type) {
        case 'poi':
            return POI
        case 'geojson':
            return GeoJson
        case 'kml':
            return KMLFeature
        default:
            throw new Error('Unknown feature type')
    }
}

const getFeatureOrLayerColor = (feature: FeatureType, layer: LayerType): { color?: string } => {
    let color: { color?: string } = {}
    if (feature.type === 'poi') {
        color = feature.color
            ? { color: feature.color }
            : layer.color
                ? { color: layer.color }
                : {}
    }
    return color
}

type POIOverlayProps = (Optional<MapFlag, "lat" | "lon" | "name"> & { x?: number, y?: number }) | null | undefined
const POIOverlay = (props: POIOverlayProps) => {

    if (!props) return null
    if (props.x === undefined || props.y === undefined) return null
    if (props.lat === undefined || props.lon === undefined) return null

    const latInfo = ddToDmm(props.lat, ['N', 'S'])
    const lonInfo = ddToDmm(props.lon, ['E', 'W'])

    return (
        <div className="p-2 bg-white dark:bg-black absolute z-50 pointer-events-none rounded-md"
            style={{ top: props.y, left: props.x, transform: "translate(-50%, -110%)" }}
        >

            <h2 className="font-bold">{props.name}</h2>
            <span>{`${latInfo.coord} ${latInfo.hemisphere}`}</span>
            <p>{`${lonInfo.coord} ${lonInfo.hemisphere}`}</p>
        </div>
    )
}

type DecadesMapProps = {
    withMenu?: boolean,
    position?: "fixed" | "absolute"
}
const DecadesMap = ({ withMenu, position }: DecadesMapProps) => {

    const { aircraftData, aircraftHistory } = useAircraftData()
    const { state, actions } = useDecadesMapState()
    const { latData, lonData, visData } = useQuickLookAircraftData()
    const [colorMap, setColorMap] = useState<string>("viridis")
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

            <Show when={state.showHeaderBar}>
                <MapHeader />
            </Show>

            <OpenLayersMap zoom={8} center={{ lon: 0, lat: 52 }} withMenu={withMenu} position={position}>

                <BaseLayer url={state.tileset.url} />

                <Show when={state.showGraticule}>
                    <Graticule />
                </Show>

                <MapCenter active={state.pinAircraft} latitude={aircraftData?.lat} longitude={aircraftData?.lon} />
                <MapClickEvent state={state} actions={actions} />
                <MouseMoveEvent state={state} actions={actions} />

                <Show when={!!state.overlay}>
                    <POIOverlay {...state.overlay} />
                </Show>

                <LiveDataOnly>
                    <VectorLayer>
                        <TrackedEntity
                            icon={{
                                src: entityIcon,
                                scale: 0.5,
                            }}
                            name='G-LUXE'
                            history={aircraftHistory}
                        />
                    </VectorLayer>
                </LiveDataOnly>

                <QuicklookOnly>
                    <MapCenter active={true} latitude={latData.filter((lat) => lat !== badData)[0]} longitude={lonData.filter((lon) => lon !== badData)[0]} />
                    <VectorLayer>
                        <Show when={visData.length > 0}>
                            <ColourBar data={visData} colorMap={colorMap} onChangeColorMap={(cm) => setColorMap(cm)} />
                            <ReliefTrack latitude={latData} longitude={lonData} data={visData} colorMap={colorMap} />
                        </Show>
                        <Show when={visData.length === 0}>
                            <Track latitude={latData} longitude={lonData} />
                        </Show>
                    </VectorLayer>
                </QuicklookOnly>

                <Show when={state.showWindVane}>
                    <VectorLayer>
                        <WindVane />
                    </VectorLayer>
                </Show>

                {state.layers.map((layer, i) => {
                    if (!layer.visible) return null
                    const Layer = LayerHash[layer.type]
                    return (
                        <Layer key={i}>
                            {layer.features.map((feature, j) => {
                                const Feature = getFeatureType(feature)
                                // This is a bit hacky: we want to use the color of the feature if it has one, otherwise use the color of the layer, if it has one
                                const color = getFeatureOrLayerColor(feature, layer)
                                return <Feature key={j} {...feature} {...color} />
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
                                src: markerIcon,
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
                    <Show when={state.mapModes.includes(DecadesMapModality.START_MEASUREMENT)}>
                        <LineMeasurementInteraction
                            addMeasurement={(startPos: Position, endPos: Position) => actions.setMeasurements([...state.measurements, [startPos, endPos]])}
                        />
                    </Show>

                    {state.measurements.map((measurement, i) => (
                        <LineMeasurement key={i}
                            startPos={measurement[0]}
                            endPos={measurement[1]}
                        />
                    ))}

                </VectorLayer>

                <VectorLayer>
                    {state.drifters.map((drifter, i) => {
                        return (
                            <Drifter key={i} {...drifter} />
                        )
                    })}
                </VectorLayer>

                <VectorLayer>
                    <Drawings drawMode={state.drawMode} />
                </VectorLayer>

                <Toolbar state={state} actions={actions} />

                <Show when={state.showToolbox}>
                    <Toolbox actions={actions} state={state} />
                </Show>

                <Show when={state.showLayersMenu}>
                    <LayersMenu
                        layers={state.layers}
                        toggleLayerVisibility={toggleLayerVisibility}
                    />
                </Show>
            </OpenLayersMap>
        </DataContext.Provider>
    )
}

export default DecadesMap;