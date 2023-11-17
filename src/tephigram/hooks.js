import { useSelector } from "react-redux"
import { base as siteBase } from "../settings"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getData, getTimeLims, plotIsOngoing } from "../plot/plotUtils";
import { getTraces, populateTephigram } from "./utils";
import { useServers, useDarkMode } from "../hooks";

const useTephiUrl = () => {
    const params = useSelector(state => state.vars.params);
    const plotOptions = useSelector(state => state.options);
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe);

    const origin = window.location.origin
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    const server = plotOptions.server
    
    let timeframe = ""
    if(useCustomTimeframe) {

    } else {
        timeframe = plotOptions.timeframes.find(x=>x.selected).value;
    }
    
    return origin + `${siteBase}tephigram?params=${selectedParams.join(',')}&timeframe=${timeframe}&server=${server}`
}

const useTephiAvailable = () => {
    const params = useSelector(state => state.vars.params);
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    
    const required_temps = [
        'deiced_true_air_temp_c', 'nondeiced_true_air_temp_c'
    ]

    const required_humids = [
        'dew_point', 'buck_mirror_temp'
    ]

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

const useTephigram = (ref) => {

    const [searchParams, _] = useSearchParams();

    const timeframe = searchParams.get('timeframe') || '30min'
    const params = searchParams.get('params') || 'deiced_true_air_temp_c,dew_point'
    const paramsArray = params.split(',')
    const servers = useServers()
    const [server, setServer] = useState(null)
    const [darkMode, setDarkMode] = useDarkMode()

    useEffect(() => {
        if(server) return
        const rServer = servers.sort(() => .5 - Math.random())[0]
        setServer(rServer)
    }, [setServer, server, servers])

    useEffect(() => {
        if(!server) return

        const options = {
            timeframe: timeframe,
            params: paramsArray,
            ordvar: 'static_pressure',
            server: server
        }

        let plotTraces = getTraces(darkMode)
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

        import('plotly.js-dist').then((Plotly) => {
            Plotly.newPlot(ref.current, plotTraces  ,  {
                margin: {t: 0, l: 0, r: 0, b: 0},   
                plot_bgcolor: darkMode ? "black" : "white",
                paper_bgcolor: darkMode ? "black" : "white",
                legend: {   
                    font: { 
                        size: 8,   
                        color: darkMode ? "white" : "black"
                    },  
                    x: 0,   
                    y: 0    ,
                    bgcolor: darkMode ? "black" : "white",
                },  
                
                hoverinfo: 'none',  
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
            .then(data=>populateTephigram(n, data, ref))
            
        if(plotIsOngoing(options)) {
            const interval = setInterval(() => {
                getData(options).then(data=>populateTephigram(n, data, ref))
            }, 1000);

            return () => clearInterval(interval)
        }

    }, [server])
}

export {
    useTephiUrl, useTephiAvailable, useTephigram
}