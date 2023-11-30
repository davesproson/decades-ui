import { useEffect, useRef, useState } from "react";
import { setParams, setParamsDispatched } from "./redux/parametersSlice";
import { setServer } from "./redux/optionsSlice";
import { apiEndpoints, apiTransforms } from "./settings";
import { useSelector, useDispatch } from "./redux/store";
import { DecadesParameter } from "./redux/parametersSlice";

import vistaLight from '../assets/css/vista-light.css?inline'
import vistaDark from '../assets/css/vista-dark.css?inline'


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
                // data = useTransform('parameters')(data)
                dispatch(setParamsDispatched(true))
                dispatch(setParams(data))
            })
            .catch((e) => {
                console.log("Error fetching parameter availability:", e)
            })
    }, [])
}

const useGetParameters = () => {
    const [params, setParams] = useState<Array<DecadesParameter> | null>(null);
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

const useDarkMode = () => {
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
        if(!vistaCss) return;
        vistaCss.innerHTML = darkMode ? vistaDark : vistaLight
      }, [darkMode])

    return [darkMode, setDarkMode];
}

const useBrainFade = <T extends HTMLElement>() => {
    const ref = useRef<T>(null)
    import ('../assets/css/transition.css')

    useEffect(() => {
        if(!ref.current) return;
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

export { 
    useDispatchParameters, useServers, useGetParameters, useDarkMode, useBrainFade
}