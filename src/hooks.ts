import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { setParams, setParamsDispatched } from "./redux/parametersSlice";
import { setServer } from "./redux/optionsSlice";
import { apiEndpoints, apiTransforms } from "./settings";
import { useSelector, useDispatch } from "./redux/store";

const useTransform = (name: string) => {
    if(apiTransforms[name]) return apiTransforms[name];
    return (data: any) => data;
}

const useDispatchParameters = () => {
    
    const dispatch = useDispatch();
    const dispatchDone = useSelector(state => state.vars.paramsDispatched);
    const paramSet = useSelector(state => state.vars.paramSet);

    let endPoint = `${apiEndpoints.parameter_availability}`
    if(paramSet) {
        endPoint = `${apiEndpoints.parameter_availability}?params=${paramSet}`
    }

    useEffect(() => {
        if(dispatchDone) return;
        fetch(endPoint)
            .then(response => response.json())
            .then(data => {
                data = useTransform('parameters')(data)
                dispatch(setParams(data))
                dispatch(setParamsDispatched(true))
            })
            .catch((e) => {
                console.log("Error fetching parameter availability:", e)
            })
    }, [])
}

const useGetParameters = () => {
    const [params, setParams] = useState(null);
    const paramSet = useSelector(state => state.vars.paramSet);

    let endPoint = `${apiEndpoints.parameters}`
    if(paramSet) {
        endPoint = `${apiEndpoints.parameters}?params=${paramSet}`
    }

    useEffect(() => {
        fetch(endPoint)
            .then(response => response.json())
            .then(data => useTransform('parameters')(data))
            .then(data => {
                setParams(data);
            })
            .catch((e) => {
                console.log("Error fetching parameters:", e)
            })
    }, [setParams])

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
                if(serverState === undefined) {
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

export { 
    useDispatchParameters, useServers, useGetParameters
}