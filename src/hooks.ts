import { useEffect } from "react"
import { useDispatch, useSelector } from "@store"

import { apiEndpoints, geoCoords, geoCoordsQuicklook, presets, presetsQuicklook } from "@/settings"
import { DecadesParameter, setParams, setParamsDispatched } from "./redux/parametersSlice"
import { isQCResponse, QCCArg, QcParameter, QcResponse } from "./quicklook/types"

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


/**
 * Selects the correct endpoint for parameter availability. If quicklook mode
 * is enabled, the quicklook endpoint is returned. If a parameter set is selected,
 * the parameter availability endpoint with the set is returned. Otherwise, the
 * default parameter availability endpoint is returned.
 * 
 * @returns The correct endpoint for parameter availability.
 */
const useParameterEndpoint = (withAvailability: boolean) => {
    const paramSet = useSelector(state => state.vars.paramSet);
    const quickLookMode = useSelector(state => state.config.quickLookMode);
    const quickLookJob = useSelector(state => state.quicklook.qcJob);

    if (quickLookMode) {
        if(!quickLookJob)
            throw new Error("No quicklook job selected")
        return `${apiEndpoints.quicklook_jobs}/${quickLookJob}/`
    }
    let endPoint = withAvailability
        ? `${apiEndpoints.parameter_availability}`
        : `${apiEndpoints.parameters}`

    if (paramSet) {
        endPoint += `?params=${paramSet}`
    }
    return endPoint;
}

/**
 * This function returns a function that can be used to transform the data
 * returned from the parameter availability endpoint. If quicklook mode is enabled,
 * the function will transform the data into an array of DecadesParameters. If
 * quicklook mode is not enabled, the function will return the data as is.
 * 
 * @param quickLookMode Whether quicklook mode is enabled.
 * @returns  A function that can be used to transform the data.
 */
const quickLookCompatability = (quickLookMode: boolean): (a: QCCArg) => Array<DecadesParameter> => {

    // If in quicklook mode, return a function that transforms the data into
    // an array of DecadesParameters. Use a type guard to ensure that the data
    // is in the correct format.
    if (quickLookMode) {
        return (data: QcResponse | Array<DecadesParameter>) => {
            if (!isQCResponse(data)) {
                throw new Error("Quicklook data is not in the expected format.")
            };
            return data.variables.map((v: QcParameter) => {
                // TODO: Add units to the quicklook data
                // TODO: Should probably use a builder pattern here
                return {
                    'ParameterIdentifier': v.name,
                    'ParameterName': v.name,
                    'DisplayText': v.long_name,
                    'DisplayUnits': 'unit',
                    'available': true
                } as DecadesParameter
            })
        }
    }

    // If not in quicklook mode, return the data as is, with a safety check
    // to ensure that the data is not in the quicklook format.
    return (data: QCCArg) => {
        if (isQCResponse(data)) {
            throw new Error("Received quicklook data when not in quicklook mode.")
        }
        return data
    }
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