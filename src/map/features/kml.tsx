import { useContext, useEffect } from "react"
import { VectorLayerContext } from "../layers/vector"
import KML from "ol/format/KML"
import VectorSource from "ol/source/Vector"

export const KMLFeature = ({ url }: { url: string }) => {
    const { layer } = useContext(VectorLayerContext)
    useEffect(() => {
        layer?.setSource(new VectorSource({
            url,
            format: new KML(),
        }))

        return () => {
            layer?.setSource(null)
        }

    }, [layer, url])

    return null
}