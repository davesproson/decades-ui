import { useEffect, useState } from "react";
import { DecadesParameter } from "@/redux/parametersSlice";
import { useSelector } from "@store";
import { apiEndpoints } from "@/settings";
import { quickLookCompatability } from "@/quicklook/utils";


/**
 * Selects the correct endpoint for parameter availability. If quicklook mode
 * is enabled, the quicklook endpoint is returned. If a parameter set is selected,
 * the parameter availability endpoint with the set is returned. Otherwise, the
 * default parameter availability endpoint is returned.
 * 
 * @returns The correct endpoint for parameter availability.
 */
export const useParameterEndpoint = (withAvailability: boolean) => {
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
 * Get a list of parameters from the server. This hook fetches a list of all
 * available parameters, but does not include any information about the
 * availability of the parameters, and is thus much cheaper than the
 * useDispatchParameters hook. Parameters are returned as an array of
 * DecadesParameters, and are not dispatched to the store.
 * 
 * @returns An array of DecadesParameters, or null if the parameters have not been fetched yet.
 * TODO: Do we actually need the null return value? An empty array might be clearer.
 */
export const useGetParameters = () => {
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
    }, [setParams, paramSet, quickLookMode, endPoint, quickLookCompatability])

    return params
}