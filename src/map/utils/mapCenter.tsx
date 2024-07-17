import { useContext, useEffect } from "react"
import { MapContext } from "../context"
import { fromLonLat } from "ol/proj"
import { badData } from "@/settings"



type MapCenterProps = {
    active: boolean,
    latitude?: number,
    longitude?: number,
    animate?: boolean
}
const MapCenter = ({active, latitude, longitude, animate}: MapCenterProps) => {
    const { state } = useContext(MapContext)

    useEffect(() => {
        if (!active) return
        if (!state.map) return
        if(latitude === badData || latitude === null || latitude === undefined) return
        if(longitude === badData || longitude === null || longitude === undefined) return

        if(animate) {
            state.map.getView().animate({center: fromLonLat([longitude, latitude]), duration: 1000})
        } else {
            state.map.getView().setCenter(fromLonLat([longitude, latitude]))
        }
            
    }, [active, latitude, longitude, state.map])

    return null
}

export { MapCenter }