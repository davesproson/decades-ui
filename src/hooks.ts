import { useEffect } from "react"
import { useDispatch, useSelector } from "@store"
import { useLoaderData } from "@tanstack/react-router"

import { geoCoords, geoCoordsQuicklook, presets, presetsQuicklook } from "@/settings"
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
    const data = useLoaderData({from: '/'})
    const dispatch = useDispatch()
    const dispatchDone = useSelector((state) => state.vars.paramsDispatched)
    useEffect(() => {
        if (dispatchDone) return
        dispatch(setParams(data))
        dispatch(setParamsDispatched(true))
    }, [dispatch, data, dispatchDone])
}

export const useGeoCoords = () => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    return quickLookMode ? geoCoordsQuicklook : geoCoords
}

export const usePresets = () => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    return quickLookMode ? presetsQuicklook : presets
}