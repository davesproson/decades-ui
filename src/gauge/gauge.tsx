import { useEffect, useRef, useState } from "react"
import Plotly from 'plotly.js-dist-min'
import { useDarkMode } from "../hooks"
import { GaugeConfig, GaugePanelProps } from "./gauge.types"
import { useGauge } from "./hooks"
import { badData } from "../settings"


const Gauge = (props: GaugeConfig) => {
    const ref = useRef<HTMLDivElement>(null)
    const [initDone, setInitDone] = useState(false)
    const [darkMode, _setDarkMode] = useDarkMode()

    const title = `${props.longName || props.parameter} (${props.units || "?"})`

    const steps = []
    if(props.dangerBelow) steps.push({ range: [props.min, props.dangerBelow], color: "#aa0000" })
    if(props.dangerAbove) steps.push({ range: [props.dangerAbove, props.max], color: "#aa0000" })

    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: props.value === badData ? null : props.value,
            title: {
                text: title,
                font: {
                    size: 12
                }
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                bar: { color: "#0abbef" },
                borderwidth: 2,
                bgcolor: darkMode ? "#333333" : "lightgray",
                axis: { range: [props.min, props.max] },
                steps: steps
            }
        }
    ];


    useEffect(() => {
        if (!ref.current) return
        // @ts-ignore - Plotly typing.... TODO
        Plotly.react(ref.current, data, layout);
    }, [props.value, ref])

    const getTextColor = () => {
        if(props.value === null) return "red"
        if(props.value < (props.dangerBelow || -9e99) || props.value > (props.dangerAbove || 9e99)) return "red"
        return darkMode ? "lightgray" : "black"
    }

    var layout = {
        margin: { t: 50, b: 8, l: 30, r: 30 },
        paper_bgcolor: darkMode ? "#0a0a0a" : "white",
        autosize: true,
        font: {
            color: getTextColor(),
        }
    };

    const config = { responsive: true, displaylogo: false }

    useEffect(() => {
        if (initDone) return

        // @ts-ignore - Plotly typing.... TODO
        Plotly.newPlot(ref.current, data, layout, config);
        setInitDone(true)
    }, [ref.current, setInitDone, initDone])

    return <div ref={ref} />
}



const GaugePanel = (props: GaugePanelProps) => {

    const configs = useGauge(props.configs || [])

    if (!configs) return <></>

    let direction = props.direction || "row"

    if (direction === "row") {
        var templateColumns = "1fr ".repeat(configs.length)
        var templateRows = "1fr"
    } else {
        var templateColumns = "1fr"
        var templateRows = "1fr ".repeat(configs.length)
    }

    return (
        <div style={{
            position: "relative",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
        }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: templateColumns,
                gridTemplateRows: templateRows,
                height: "100%",
                width: "100%",
            }}>

                {configs.map((config, i) => <Gauge key={i} {...config} />)}

            </div>
        </div>
    )
}

const GaugePanelDispatcher = () => {
    return <GaugePanel configs={[]} direction="row" />
}

export default GaugePanelDispatcher
export { GaugePanel }