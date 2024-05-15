import { useOpenLayersMap } from "./hooks";
import { MapContext } from "./context";

type MapProps = {
    children: React.ReactNode,
    zoom?: number,
    top?: number,
    center?: {
        lat: number,
        lon: number
    }
}

const OpenLayersMap = (props: MapProps) => {
    const {mapRef, state, actions} = useOpenLayersMap({
        zoom: props.zoom || 5,
        center: props.center || {lat: 0, lon: 0}
    })

    return (
        <MapContext.Provider value={{state, actions}}>
            <div ref={mapRef} style={{position: "absolute", inset: 0, top: props.top || 0}}>
                {props.children}
            </div>
        </MapContext.Provider>
    )
}

export default OpenLayersMap;