import { useOpenLayersMap } from "./hooks";
import { MapContext } from "./context";


const Map = ({children}: {children: React.ReactNode}) => {
    const {mapRef, state, actions} = useOpenLayersMap()

    return (
        <MapContext.Provider value={{state, actions}}>
            <div ref={mapRef} style={{position: "fixed", inset: 0}}>
                {children}
            </div>
        </MapContext.Provider>
    )
}

export default Map;