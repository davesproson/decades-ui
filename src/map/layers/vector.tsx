import { createContext, useContext, useEffect, useState } from 'react';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { MapContext } from '../context';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';

type VectorLayerContextType = {
    layer: VectorLayer<Feature<Geometry>> | null
}

const VectorLayerContext = createContext<VectorLayerContextType>({
    layer: null
})

type VectorLayerProps = {
    children?: React.ReactNode
}
const ReactVectorLayer = (props: VectorLayerProps) => {
    const [layer, setLayer] = useState<VectorLayer<Feature> | null>(null)
    const { state } = useContext(MapContext)

    useEffect(() => {
        const vectorLayer = new VectorLayer({
            source: new VectorSource()
        })

        setLayer(vectorLayer)
        state.map?.addLayer(vectorLayer)

        return () => {
            state.map?.removeLayer(vectorLayer)
            vectorLayer.setSource(null)
        }
    }, [state.map])

    return (
        <VectorLayerContext.Provider value={{ layer }}>
            {props.children}
        </VectorLayerContext.Provider>
    )
}

export { ReactVectorLayer as VectorLayer, VectorLayerContext }