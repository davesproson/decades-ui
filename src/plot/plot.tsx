import { useRef, forwardRef, useEffect } from 'react'
import { usePlot, usePlotOptions } from './hooks'
import { PlotHeaderDash } from '../dashboard/dashboard'
import { plotHeaderDefaults } from '../settings'
import  Loader from '../components/loader'
import { PlotURLOptions } from "./types"
import { useDispatch } from 'react-redux'
import { setQcJob } from '@/redux/quicklookSlice'
import { setQuickLookMode } from '@/redux/configSlice'

interface PlotProps {
    parameters: string[] | null,
    loadDone?: boolean,
    style?: any,
}
const Plot = forwardRef((props: PlotProps, ref: React.Ref<HTMLDivElement>) => {

    const load = props.loadDone ? null : <Loader text="Loading plot..." />

    const dash = props.parameters
        ? <PlotHeaderDash
            params={Array(...new Set([...props.parameters, ...plotHeaderDefaults]))}
          />
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

interface SimplePlotProps {
    params: string[],
    style?: any,
}
const SimplePlot = (props: SimplePlotProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const options = {
        params: props.params,
        axes: props.params,
        swapxy: false,
        ordvar: "utc_time",
        timeframe: "5min",
        scrolling: true,
        header: false,
        style: "line",      
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

type PlotDispatcherProps = Partial<PlotURLOptions> & {
    containerStyle?: any,
}
const PlotDispatcher = (props?: PlotDispatcherProps) => {
    
    const ref = useRef<HTMLDivElement>(null)
    const options = usePlotOptions(props);
    const loadDone = usePlot(options, ref)
    const dispatch = useDispatch()

    useEffect(() => {
        const job = options?.job
        if(!job) {
            dispatch(setQuickLookMode(false))
            return
        }
        dispatch(setQcJob(job))
        dispatch(setQuickLookMode(true))
    }, [options?.job, dispatch, setQcJob, setQuickLookMode])

    if(!options) return <></>
    if(!props) return <></>

    const headerParams = options.header 
        ? options.params
        : null

    return <Plot ref={ref} 
        parameters={headerParams} 
        loadDone={loadDone} 
        style={props.containerStyle}
    />
    
}

export default PlotDispatcher
export { SimplePlot, Plot }