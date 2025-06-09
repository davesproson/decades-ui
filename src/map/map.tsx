import { useOpenLayersMap } from "./hooks";
import { MapContext } from "./context";
import { MapParamSelector } from "./param-select";
import { QuicklookOnly } from "@/components/flow";

type MapProps = {
    children: React.ReactNode,
    zoom?: number,
    withMenu?: boolean,
    center?: {
        lat: number,
        lon: number
    }
    position?: "fixed" | "absolute"
}

const OpenLayersMap = (props: MapProps) => {
    const { mapRef, state, actions } = useOpenLayersMap({
        zoom: props.zoom || 5,
        center: props.center || { lat: 0, lon: 0 }
    })

    const top = props.withMenu ? 40 : 0

    return (
        <MapContext.Provider value={{ state, actions }}>
            <QuicklookOnly>
                <MapParamSelector />
            </QuicklookOnly>
            <div ref={mapRef} style={{ position: props.position || "fixed", bottom: 0, left: 0, right: 0, top: top }}>
                {props.children}
            </div>
        </MapContext.Provider>
    )
}

export default OpenLayersMap;