import Map from './map';

import { DataContext } from './context';
import { useAircraftData } from './hooks';
import { MapHeader } from './header';
import { BaseLayer } from './layers/base';
import { TrackedEntity } from './features/trackedEntity';
import { useScrollInhibitor } from '../hooks';
import { VectorLayer } from './layers/vector';
import { POI } from './features/poi';
import { Toolbar } from './controls';
import { Toolbox } from './toolbox';
import { useState } from 'react';
import { LayersMenu } from './layersMenu';
import { GeoJson } from './features/geojson';

const LayerHash = {
    'vector': VectorLayer,
    'geojson': VectorLayer
}

type POIFeatureType = {
    type: "poi",
    latitude: number,
    longitude: number,
    color?: string
}
type GeoJsonFeatureType = {
    type: "geojson"
    data?: any
}
type FeatureType = POIFeatureType | GeoJsonFeatureType

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


interface AbstractLayerType {
    type: string,
    name: string,
    visible: boolean
}

interface POILayerType extends AbstractLayerType {
    type: 'vector',
    features: {
        type: 'poi',
        latitude: number,
        longitude: number,
        color?: string
    }[]
}
interface GeoJsonLayerType extends AbstractLayerType {
    type: 'geojson',
    features: {
        type: 'geojson',
        data: any
    }[]
}
type LayerType = POILayerType | GeoJsonLayerType

const DecadesMap = () => {
    const { aircraftData, aircraftHistory } = useAircraftData()
    const [showHeader, setShowHeader] = useState<boolean>(false)
    const [showLayersMenu, setShowLayersMenu] = useState<boolean>(false)
    const [showToolbox, setShowToolbox] = useState<boolean>(false)

    useScrollInhibitor(true)

    const [layers, setLayers] = useState<LayerType[]>([{
        type: 'vector',
        visible: false,
        name: 'ARA Waypoints',
        features: [{
            type: 'poi',
            latitude: 52,
            longitude: 0,
            color: 'red'
        }, {
            type: 'poi',
            latitude: 52,
            longitude: -1.2,
            color: 'green'
        }]
    }])

    const state = {
        showHeader,
        showLayersMenu,
        showToolbox,
        layers,
    }

    const actions = {
        setShowHeader,
        setShowLayersMenu,
        setLayers,
        setShowToolbox,
    }

    const toggleLayerVisibility = (name: string) => {
        setLayers(layers.map(layer => {
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
            <MapHeader show={showHeader} />
            <Map top={showHeader ? 0 : 0}>
                <BaseLayer />

                <TrackedEntity
                    icon={{
                        src: 'mapicons/g-luxe.png',
                        scale: 0.5,
                        name: 'G-LUXE'
                    }}
                />

                {layers.map((layer, i) => {
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

                <Toolbar state={state} actions={actions} />
                <Toolbox show={showToolbox} />
                <LayersMenu show={showLayersMenu} layers={layers} toggleLayerVisibility={toggleLayerVisibility} />
            </Map>
        </DataContext.Provider>
    )
}

export default DecadesMap;