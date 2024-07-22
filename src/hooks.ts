import { useEffect } from "react"
import { useDispatch, useSelector } from "@store"

import { apiEndpoints, geoCoords, geoCoordsQuicklook, presets, presetsQuicklook } from "@/settings"
import { setParams, setParamsDispatched } from "./redux/parametersSlice"

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
    const paramSet = useSelector((state) => state.vars.paramSet)

    useEffect(() => {
        if (dispatchDone) return
        const url = new URL(window.location.href)
        url.pathname = apiEndpoints.parameter_availability
        url.searchParams.set('params', paramSet)
        fetch(url.toString()).then(
            response => response.json()
        ).then(data => {
            dispatch(setParams(data))
            dispatch(setParamsDispatched(true))
        })


    }, [dispatch, dispatchDone])
}

export const useGeoCoords = () => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    return quickLookMode ? geoCoordsQuicklook : geoCoords
}

export const usePresets = () => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    return quickLookMode ? presetsQuicklook : presets
}