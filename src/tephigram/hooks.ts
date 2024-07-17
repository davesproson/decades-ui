import { useSelector } from "../redux/store"
import { badData, base as siteBase } from "../settings"
import { useEffect } from "react";
import { getData } from "@/data/utils";
import { populateTephigram } from "./utils";
import { getTraces } from "./traces";
import { useDarkMode } from "@/components/theme-provider";
import type { TephigramOptions, TephigramTrace, BackgroundTrace, TephigramData } from "./types";
import { getTimeLims } from "@/timeframe/utils";
import { plotIsOngoing } from "@/plot/utils";
import { TephigramSearchParams } from "@/routes/tephigram";

const useTephiUrl = () => {
    const params = useSelector(state => state.vars.params);
    const plotOptions = useSelector(state => state.options);
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe);
    const customTimeframe = useSelector(state => state.options.customTimeframe);
    const qcJob = useSelector(state => state.quicklook.qcJob)
    const quickLookMode = useSelector(state => state.config.quickLookMode)

    const origin = window.location.origin
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    
    let timeframe = ""
    if(useCustomTimeframe) {
        let start = customTimeframe.start
        let end = customTimeframe.end
        if(start) start /= 1000
        if(end) end /= 1000
        timeframe = `${start},`
        timeframe += end ? end : ""
    } else {
        timeframe = plotOptions.timeframes.find(x=>x.selected)?.value || "30min";
    }
    
    const tephiUrl = new URL(`${siteBase}tephigram`, origin)
    tephiUrl.searchParams.set("params", selectedParams.join(','))
    tephiUrl.searchParams.set("timeframe", timeframe)
    if(qcJob && quickLookMode) {
        tephiUrl.searchParams.set("job", qcJob)
    }

    return tephiUrl.toString()
}

const useTephiAvailable = () => {
    const params = useSelector(state => state.vars.params);
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    
    const required_temps = quickLookMode
        ? ['TAT_DI_R', 'TAT_ND_R']
        : ['deiced_true_air_temp_c', 'nondeiced_true_air_temp_c']

    const required_humids = quickLookMode
        ? ['TDEW_GE', 'TDEWCR2C']
        : ['dew_point', 'buck_mirror_temp']

    let has_required_temps = false
    let has_required_humids = false

    for(const param of selectedParams) {
        if(!required_humids.includes(param) && !required_temps.includes(param)) {
            return false
        }
        if(required_temps.includes(param)) {
            has_required_temps = true
        }
        if(required_humids.includes(param)) {
            has_required_humids = true
        }
    }

    return has_required_temps && has_required_humids
}

/**
 * Normalize the data from the server to a format that can be used by the 
 * tephigram plot. When in quicklook mode, the static pressure data is
 * stored in the PS_RVSM key, so we need to move it to the static_pressure
 * key.
 * 
 * @param data The data from the server
 * @returns The normalized data
 */
const normalizeTephiData = (data: TephigramData) => {
    if('PS_RVSM' in data) {
        data.static_pressure = [...data.PS_RVSM]
        delete data.PS_RVSM
    } else {
        return data
    }
    for(const key in data) {
        if(key === 'static_pressure' || key === 'utc_time') continue
        data[key] = data[key].map(x=>{
            if(x === badData) return x
            return x - 273.15
        })
    }
    return data
}

const useTephigram = (ref: React.RefObject<HTMLDivElement>, options?: TephigramSearchParams) => {

    const searchParams = new URL(location.href).searchParams

    const timeframe = searchParams.get('timeframe') || "30min"
    const params = searchParams.get('params') || "deiced_true_air_temp_c,dew_point"
    const paramsArray = params.split(',')
    const darkMode = useDarkMode()
    const quickLookMode = useSelector(state => state.config.quickLookMode)
    options

    useEffect(() => {

        const options: TephigramOptions = {
            timeframe: timeframe,
            params: paramsArray,
            ordvar: quickLookMode ? 'PS_RVSM' : 'static_pressure',
        }

        let plotTraces: Array<BackgroundTrace | TephigramTrace> = getTraces(darkMode ? true : false)
        const n = plotTraces.length;
        const colors = [
            "#0000aa", "#00aa00", "#aa0000", "#00aaaa", "#aa00aa"
        ]

        options.params.forEach((p, i) => {
            plotTraces.push({
                x: [],
                y: [],
                showlegend: true,
                mode: 'lines',
                hoverinfo: 'none',
                name: p,
                line: {
                    width: 5,
                    color: colors[i%colors.length]
                }
            });
        });

        import('plotly.js-dist-min').then((Plotly) => {
            if(!ref.current) {
                console.warn("No ref for tephigram plot")
                return
            }
            Plotly.newPlot(ref.current, plotTraces  ,  {
                margin: {t: 0, l: 0, r: 0, b: 0},   
                plot_bgcolor: darkMode ? "#0a0a0a" : "white",
                paper_bgcolor: darkMode ? "#0a0a0a" : "white",
                legend: {   
                    font: { 
                        size: 8,   
                        color: darkMode ? "white" : "#0a0a0a"
                    },  
                    x: 0,   
                    y: 0    ,
                    bgcolor: darkMode ? "#0a0a0a" : "white",
                },  
                yaxis: {    
                    range: [1678, 1820],    
                    showline: false,    
                    ticks: '',  
                    showgrid: false,    
                    showticklabels: false   
                },  
                xaxis: {    
                    range: [1600, 1780],    
                    showline: false,    
                    ticks: '',  
                    showgrid: false,    
                    showticklabels: false   
                }   
            }, {    
                displayModeBar:false,   
                responsive: true,
                displaylogo: false
            })
        });

        
        getData(options, ...getTimeLims(options.timeframe))
            .then(data=>{
                const normalizedData = normalizeTephiData(data as TephigramData)
                populateTephigram(n, normalizedData, ref)
            })
            
        if(plotIsOngoing(options)) {
            const interval = setInterval(() => {
                if(!(document.visibilityState === "visible")) return
                getData(options).then(data=>{
                    const normalizedData = normalizeTephiData(data as TephigramData)
                    populateTephigram(n, normalizedData, ref)
                })
            }, 1000);

            return () => clearInterval(interval)
        }

    }, [])
}

export {
    useTephiUrl, useTephiAvailable, useTephigram
}