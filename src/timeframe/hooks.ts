import { useState, useEffect, RefObject } from 'react';
import { badData, geoCoords, geoCoordsQuicklook } from '../settings';

import * as Plotly from 'plotly.js-dist-min'

import { PlotlyHTMLDivElement } from './types'
import { useDarkMode } from '@/components/theme-provider';
import { useDispatch, useSelector } from '@store';
import { getTimeLims } from './utils';
import { setCustomTimeframe } from '@/redux/optionsSlice';
import { DecadesDataResponse } from '@/data/types.ts';
import { getData } from '@/data/utils.ts';

/**
 * This hook creates a Plotly plot with a range selector. It displays the
 * flight's altitude, and the range slider allows the user to select a
 * custom timeframe.
 * 
 * @param ref - a reference to the Plotly div
*/
const useSelectorPlot = (ref: RefObject<PlotlyHTMLDivElement>) => {
    const darkMode = useDarkMode()
    const [xData, setXData] = useState<Array<number>>([])
    const [yData, setYData] = useState<Array<number>>([])
    const timeData = xData.map(x=>new Date(x*1000))
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe)
    const timeframe = useSelector(state => state.options.timeframes.find(x=>x.selected))
    const customTimeframe = useSelector(state => state.options.customTimeframe)
    const quicklookMode = useSelector(state => state.config.quickLookMode)
    const qcJob = useSelector(state => state.quicklook.qcJob)
    const dispatch = useDispatch()

    let startTime = useCustomTimeframe
        ? customTimeframe.start
        : getTimeLims(timeframe?.value || "30mins")[0] * 1000

    let endTime = useCustomTimeframe
        ? customTimeframe.end
        : getTimeLims(timeframe?.value || "30mins")[1] * 1000

    const timeLimits: [Date, Date] = [
        startTime ? new Date(startTime) : timeData[0],
        endTime ? new Date(endTime) : timeData[timeData.length-1]
    ]

    const layout: Partial<Plotly.Layout> = {
        plot_bgcolor: darkMode ? "#0a0a0a" : "white",
        paper_bgcolor: darkMode ? "#0a0a0a" : "white",
        margin: { t:0, l:0, r:10, b: 0 },
        xaxis: {
            range: timeLimits,
            fixedrange: true,
            rangeslider: {
                range: [timeData[0], timeData[timeData.length-1]],
                thickness: .2,
            },
            type: 'date',
            showgrid: false,
            showline: false,
            showticklabels: false,
        },
        yaxis: {
            showgrid: false,
            showticklabels: false,
            autorange: true,
        },
    }
    
    /**
     * This first effect is responsible for creating the Plotly plot and
     * updating it when the data change. It also listens for changes in the
     * x-axis range and updates the custom timeframe accordingly.
     */
    useEffect(() => {
        if(!ref?.current) return

        // Create the Plotly plot
        Plotly.newPlot(ref.current, [{
            x: timeData,
            y: yData,
            type: 'scatter',
            mode: 'lines',
            line: {color: (darkMode ? "white": "black"), width: 3},
        }], layout as any, {responsive: true, displayModeBar: false})

        // Listen for changes in the x-axis range...
        ref.current.on('plotly_relayout', (event: any) => {
            if(!event['xaxis.range']) return
            const limits = {
                start: new Date(event['xaxis.range'][0]).getTime(),
                end: new Date(event['xaxis.range'][1]).getTime(),
            }
            // ...and update the custom timeframe accordingly
            dispatch(setCustomTimeframe(limits))
        })

        return () => {
            // Remove the Plotly plot when the component unmounts
            if(!ref.current) return
            ref.current.removeAllListeners('plotly_relayout')
            Plotly.purge(ref.current)
        }

    }, [ref, xData, yData, darkMode])

    /**
     * This effect fetches the altitude data from the API and updates the
     * xData and yData states. This effect only runs once when the component
     * mounts.
     */
    useEffect(() => {

        // We wants all the data
        const timeLims = [0, undefined]

        // Select the altitude parameter based on the current mode
        const altitudeParam = quicklookMode
            ? geoCoordsQuicklook.altitude
            : geoCoords.altitude

        // Fetch the data...
        getData({
            params: ['utc_time', altitudeParam],
            server: window.location.host
        }, ...timeLims).then((data: DecadesDataResponse) => {
            // ...filter out bad data...
            data[altitudeParam] = data[altitudeParam].map((x: number) => {
                if(x === badData) return NaN
                return x
            })
            // ...and update the xData and yData states
            setXData(data['utc_time'])
            setYData(data[altitudeParam])
        })
    }, [quicklookMode, qcJob])

    /**
     * This effect updates the Plotly plot when the custom timeframe changes.
     */
    useEffect(() => {
        if(!ref.current) return
        Plotly.relayout(ref.current, layout as any)
    }, [timeLimits])

    // Return true if the data is loaded, false otherwise
    if(xData.length === 0) return false
    return true
}

export { useSelectorPlot }