import { useEffect, useRef, useState } from "react";
import { setParams, setParamsDispatched } from "./redux/parametersSlice";
import { setServer } from "./redux/optionsSlice";
import { apiEndpoints, apiTransforms } from "./settings";
import { useSelector, useDispatch } from "./redux/store";
import { DecadesParameter } from "./redux/parametersSlice";

import vistaLight from '../assets/css/vista-light.css?inline'
import vistaDark from '../assets/css/vista-dark.css?inline'
import { QCCArg, QcParameter, QcResponse, isQCResponse } from "./types";


const useTransform = (name: string) => {
    if (apiTransforms[name]) return apiTransforms[name];
    return (data: any) => data;
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

    if (quickLookMode) {
        // TODO: Add quicklook endpoint
        throw new Error("Quicklook mode not yet implemented.")
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
            return data.vars.map((v: QcParameter) => {
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

/**
 * This hook dispatches the parameter availability data to the store. It fetches
 * the data from the parameter availability endpoint and transforms it using the
 * quickLookCompatability function. The data is then dispatched to the store.
 * 
 * This hook should be used when the parameter availability data is needed in the
 * store - typically this is done during the initialisation of the application.
 */
const useDispatchParameters = () => {

    const dispatch = useDispatch();
    const dispatchDone = useSelector(state => state.vars.paramsDispatched);
    const paramSet = useSelector(state => state.vars.paramSet);
    const quickLookMode = useSelector(state => state.config.quickLookMode);

    const endPoint = useParameterEndpoint(true)

    useEffect(() => {
        // If the data has already been dispatched, return early
        if (dispatchDone) return;

        // Fetch the data from the endpoint and transform it using the quickLookCompatability
        fetch(endPoint)
            .then(response => response.json())
            .then(data => {
                const cData = quickLookCompatability(quickLookMode)(data)

                // Dispatch the data to the store
                dispatch(setParamsDispatched(true))
                dispatch(setParams(cData))
            })
            .catch((e) => {
                console.log("Error fetching parameter availability:", e)
            })
    }, [paramSet, setParams, setParamsDispatched, dispatchDone])
}

/**
 * Get a list of parameters from the server. This hook fetches a list of all
 * available parameters, but does not include any information about the
 * availability of the parameters, and is thus much cheaper than the
 * useDispatchParameters hook. Parameters are returned as an array of
 * DecadesParameters, and are not dispatched to the store.
 * 
 * @returns An array of DecadesParameters, or null if the parameters have not been fetched yet.
 * TODO: Do we actually need the null return value? An empty array might be clearer.
 */
const useGetParameters = () => {
    const [params, setParams] = useState<Array<DecadesParameter> | null>(null);
    const paramSet = useSelector(state => state.vars.paramSet);
    const quickLookMode = useSelector(state => state.config.quickLookMode);

    const endPoint = useParameterEndpoint(false)

    useEffect(() => {
        fetch(endPoint)
            .then(response => response.json())
            .then(data => useTransform('parameters')(data))
            .then(data => {
                const cData = quickLookCompatability(quickLookMode)(data)
                setParams(cData);
            })
            .catch((e) => {
                console.log("Error fetching parameters:", e)
            })
    }, [setParams, paramSet])

    return params
}

const useServers = () => {
    const [servers, setServers] = useState([]);
    const serverState = useSelector(state => state.options.server);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch(`${apiEndpoints.tank_status}`)
            .then(response => response.json())
            .then(data => useTransform('tank_status')(data))
            .then(data => {
                const reportedServers = data.topo.secondaries
                reportedServers.push(data.topo.primary)
                setServers(reportedServers);
                if (serverState === undefined) {
                    const serverToSet = reportedServers.sort(() => .5 - Math.random())[0]
                    dispatch(setServer(serverToSet))
                }
            })
            .catch(() => {
                console.error("Error fetching servers")
                dispatch(setServer(null))
            })

    }, [])

    return servers;

}

const useDarkMode = (): [boolean, (dm: boolean) => void] => {
    const darkModeStorageName = "vistaDarkMode"

    const getDarkMode = () => {
        return localStorage.getItem(darkModeStorageName) === 'true';
    }

    const [darkMode, _setDarkMode] = useState(getDarkMode())
    const setDarkMode = (mode: boolean) => {
        localStorage.setItem(darkModeStorageName, mode.toString());
        _setDarkMode(mode);
    }

    useEffect(() => {
        const vistaCss = document.getElementById("vista-css")
        if (!vistaCss) return;
        vistaCss.innerHTML = darkMode ? vistaDark : vistaLight
    }, [darkMode])

    return [darkMode, setDarkMode];
}

const useBrainFade = <T extends HTMLElement>() => {
    const ref = useRef<T>(null)
    import('../assets/css/transition.css')

    useEffect(() => {
        if (!ref.current) return;
        setTimeout(() => {
            ref.current?.classList.add("appear")
            ref.current?.classList.remove("disappear")
        }, 0)
        return () => {
            ref.current?.classList.remove("appear")
            ref.current?.classList.add("disappear")
        }
    }, [ref.current])

    return ref;
}

const useNoScroll = (stopScroll: boolean) => {
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

export {
    useDispatchParameters, useServers, useGetParameters, useDarkMode, useBrainFade,
    useNoScroll
}