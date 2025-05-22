import { useOpenLayersMap } from "./hooks";
import { MapContext } from "./context";

type MapProps = {
    children: React.ReactNode,
    zoom?: number,
    withMenu?: boolean,
    center?: {
        lat: number,
        lon: number
    }
}

const OpenLayersMap = (props: MapProps) => {
    const { mapRef, state, actions } = useOpenLayersMap({
        zoom: props.zoom || 5,
        center: props.center || { lat: 0, lon: 0 }
    })

    const top = props.withMenu ? 40 : 0

    return (
        <MapContext.Provider value={{ state, actions }}>
            <div ref={mapRef} style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: top }}>
                {props.children}
            </div>
        </MapContext.Provider>
    )
}

export default OpenLayersMap;