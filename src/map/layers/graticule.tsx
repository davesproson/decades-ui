import { useContext, useEffect } from 'react';
import { MapContext } from '../context'
import { Graticule as OLGraticule } from 'ol/layer';
import Stroke from 'ol/style/Stroke';

const Graticule = () => {
    const { state } = useContext(MapContext)

    useEffect(() => {
        if(!state.map) return
        const graticule = new OLGraticule({
            strokeStyle: new Stroke({
                color: 'rgba(0,0,0,0.9)',
                width: 2,
                lineDash: [0.5, 4],
            }),
            targetSize: 100,
            showLabels: true,
            wrapX: false,
        });

        state.map.addLayer(graticule);

        return () => {
            state?.map?.removeLayer(graticule)
        }
    }, [state.map])

    return null
}

export { Graticule }