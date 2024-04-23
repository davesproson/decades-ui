import { useOpenLayersMap } from "./hooks";
import { MapContext } from "./context";

type MapProps = {
    children: React.ReactNode,
    top?: number,
}

const Map = (props: MapProps) => {
    const {mapRef, state, actions} = useOpenLayersMap()
    

    return (
        <MapContext.Provider value={{state, actions}}>
            <div ref={mapRef} style={{position: "absolute", inset: 0, top: props.top || 0}}>
                {props.children}
            </div>
        </MapContext.Provider>
    )
}

export default Map;