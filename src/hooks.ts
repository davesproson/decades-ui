import { useEffect, useRef, useState } from "react";
import { setParams, setParamsDispatched } from "./redux/parametersSlice";
import { setCustomTimeframe, setServer } from "./redux/optionsSlice";
import { apiEndpoints, geoCoords, geoCoordsQuicklook } from "./settings";
import { useSelector, useDispatch } from "./redux/store";
import { DecadesParameter } from "./redux/parametersSlice";

import vistaLight from '../assets/css/vista-light.css?inline'
import vistaDark from '../assets/css/vista-dark.css?inline'
import { QCCArg, QcParameter, QcResponse, isQCResponse } from "./types";
import { useSearchParams } from "react-router-dom";



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

/**
 * A hook to fetch the list of servers from the tank status endpoint. This
 * hook should be used in the root component of the application to ensure
 * that the server list is fetched when the application is mounted.
 * 
 * If no server is set in the store, a random server is selected from the
 * list of reported servers and set in the store. This becomes the default
 * server for data fetching.
 * 
 * @returns an array of servers
 * 
 */
const useServers = () => {
    const [servers, setServers] = useState<Array<string>>([]);
    const serverState = useSelector(state => state.options.server);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch(`${apiEndpoints.tank_status}`)
            .then(response => response.json())
            .then(data => {
                const reportedServers = data.topo.secondaries
                reportedServers.push(data.topo.primary)
                setServers(reportedServers);

                // If no server is set in the store, set a random server
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

/**
 * A hook to manage the dark mode state. This hook uses local storage to
 * persist the dark mode state between sessions. It also updates the CSS
 * variables to change the theme of the application. This hook should be
 * used in the root component of the application.
 * 
 * @returns the dark mode state and a function to set the dark mode state.
 */
const useDarkMode = (): [boolean, (dm: boolean) => void] => {

    const [searchParams] = useSearchParams()

    // The name of the local storage item
    const darkModeStorageName = "vistaDarkMode"

    // Get the dark mode state from local storage
    const getDarkMode = () => {
        if(searchParams.get('darkmode') === 'true') return true
        if(searchParams.get('darkmode') === 'false') return false
        return localStorage.getItem(darkModeStorageName) === 'true';
    }

    // State hook to manage the dark mode state
    const [darkMode, _setDarkMode] = useState(getDarkMode())

    /**
     * A custom setter function that updates the dark mode state and persists
     * the state to local storage.
     * 
     * @param mode - the new dark mode state
     */
    const setDarkMode = (mode: boolean) => {
        localStorage.setItem(darkModeStorageName, mode.toString());
        _setDarkMode(mode);
    }

    // An effect hook to update the CSS variables when the dark mode state
    // changes
    useEffect(() => {
        const vistaCss = document.getElementById("vista-css")
        if (!vistaCss) return;
        vistaCss.innerHTML = darkMode ? vistaDark : vistaLight
    }, [darkMode])

    return [darkMode, setDarkMode];
}

/**
 * Brainfade transition effect. So named because this is a deeply 
 * stupid way to do this. Ah well.
 * 
 * The hook just provides a bit of eye candy for when a component
 * is mounted or unmounted. It adds a class to the element that
 * fades it in or out.
 * 
 * Note: this hook probably shouldn't be used directly. Instead, use
 * the FadeOut Component.
 * 
 * @returns a react ref to attach to the element you want to fade
 * 
 */
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

/**
 * A hook to inhibit scrolling on the body element. This is useful for
 * modals and other components that should prevent scrolling when they
 * are open, or splash screens that should prevent scrolling until they
 * are dismissed etc.
 * 
 * @param stopScroll - a boolean that determines whether to stop scrolling
 */
const useScrollInhibitor = (stopScroll: boolean) => {
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

/**
 * A hook to set the custom timeframe for the quicklook plot. This hook
 * fetches the UTC time from the quicklook data endpoint and sets the
 * custom timeframe in the store.
 * 
 * TODO: Why is this here? This should probably be in the quicklook module.
 * 
 * @returns 
 */
const useQuickLookTimeframe = () => {
    const qcJob = useSelector(state => state.quicklook.qcJob)
    const dispatch = useDispatch()

    // If there is no quicklook job, return early
    if(!qcJob) return

    // Build the query URL
    const dataURL = new URL(apiEndpoints.quicklook_data)
    dataURL.searchParams.set('job', qcJob)
    dataURL.searchParams.set('para', 'utc_time')

    // Fetch the data and set the custom timeframe
    fetch(dataURL)
      .then(response => response.json())
      .then(data => {
        const time = data.utc_time
        const startTime = time[0] * 1000
        const endTime = time[time.length - 1] * 1000
        dispatch(setCustomTimeframe({start: startTime, end: endTime}))
      })
      .catch(e => {
        console.error("Error fetching quicklook timeframe:", e)
      })
}

const useGeoCoords = () => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    return quickLookMode ? geoCoordsQuicklook : geoCoords
}

export {
    useDispatchParameters, useServers, useGetParameters, useDarkMode, useBrainFade,
    useScrollInhibitor, useQuickLookTimeframe, useGeoCoords
}