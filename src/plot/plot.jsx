import noscroll from "../../assets/css/no-scroll.css"

import { useRef, forwardRef } from 'react'
import { usePlot, usePlotOptions } from './hooks'
import { Dashboard } from '../dashboard/dashboard'
import { plotHeaderDefaults } from '../settings'
import { Loader } from '../components/loader'

const Plot = forwardRef((props, ref) => {

    const load = props.loadDone ? null : <Loader text="Loading plot..." />

    const dash = props.parameters
        ? <Dashboard parameters={Array(...new Set([...props.parameters, ...plotHeaderDefaults]))} />
        : null

    const style = props.style || {     
        top: "0px",
        left: "0px",
        right: "0px",
        bottom: "0px",  
        position: "absolute",
        display: "flex",
        flexDirection: "column",  
    }

    return (
        <div style={style}>
            {dash}
            <div ref={ref} style={{
                width: "100%",
                height: "100%",
            }}>{load}</div>
        </div>
    )
})

const SimplePlot = (props) => {
    const ref = useRef(null)
    const options = {
        params: props.params,
        axes: props.params,
        swapxy: false,
        ordvar: "utc_time",
        timeframe: "5min",
        scrolling: true,
    }

    usePlot(options, ref)

    const style = props.style ? props.style : {
        height: "100%",
        width: "100%",
        position: "relative",
    }

    return (
        <div ref={ref} style={style}></div>
    )
}

const PlotDispatcher = (props) => {
    
    const ref = useRef(null)
    const options = usePlotOptions(props);
    const loadDone = usePlot(options, ref)

    const headerParams = options.header 
        ? options.params
        : null

    return <Plot ref={ref} parameters={headerParams} loadDone={loadDone} style={props.style}/>
    
}

export default PlotDispatcher
export { SimplePlot, Plot }