import { useEffect } from "react"
import { useDispatch, useSelector } from "@store"
import { useParameterEndpoint } from "@/parameters/hooks"
import { geoCoords, geoCoordsQuicklook, presets, presetsQuicklook } from "@/settings"
import { setParams, setParamsDispatched } from "@/redux/parametersSlice"
import { quickLookCompatability } from "@/quicklook/utils"
import { authFetch as fetch } from "./utils"

export const useScrollInhibitor = (stopScroll: boolean) => {
    useEffect(() => {
        if (stopScroll) {
            document.body.classList.add('no-scroll')
        } else {
            document.body.classList.remove('no-scroll')
        }
        return () => {
            document.body.classList.remove('no-scroll')
        }
    }, [stopScroll])
}

export const useParameterPresets = (): {[key: string]: string[]} => {
    const quickLookMode = useSelector((state) => state.config.quickLookMode)
    return quickLookMode ? presetsQuicklook : presets
}



export const useDispatchParameters = () => {
    const dispatch = useDispatch()
    const dispatchDone = useSelector((state) => state.vars.paramsDispatched)
    const quickLookMode = useSelector((state) => state.config.quickLookMode)
    const endPoint = useParameterEndpoint(true)

    useEffect(() => {
        if (dispatchDone) return
        fetch(endPoint).then(
            response => response.json()
        ).then(data => {
            const cData = quickLookCompatability(quickLookMode)(data)
            dispatch(setParams(cData))
            dispatch(setParamsDispatched(true))
        })


    }, [dispatch, dispatchDone, endPoint, quickLookMode])
}

export const useGeoCoords = () => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    return quickLookMode ? geoCoordsQuicklook : geoCoords
}

export const usePresets = () => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    return quickLookMode ? presetsQuicklook : presets
}