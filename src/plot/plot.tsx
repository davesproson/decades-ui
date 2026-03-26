import React, { useRef, forwardRef, useEffect, useState } from 'react'
import { usePlot, usePlotOptions } from './hooks'
import { PlotHeaderDash } from '../dashboard/dashboard'
import { plotHeaderDefaults } from '../settings'
import Loader from '../components/loader'
import { PlotURLOptions } from "./types"
import { useDispatch } from 'react-redux'
import { setQcJob } from '@/redux/quicklookSlice'
import { setQuickLookMode } from '@/redux/configSlice'

interface StaleOverlayProps {
    staleSeconds: number,
    onDismiss: () => void,
}

const StaleOverlay = ({ staleSeconds, onDismiss }: StaleOverlayProps) => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
        <div className="bg-background rounded-lg p-6 text-center w-72 shadow-lg border">
            <p className="text-lg font-semibold mb-2">Data feed not updating</p>
            <p className="text-sm text-muted-foreground mb-4">Last data received {staleSeconds} seconds ago.</p>
            <button
                onClick={onDismiss}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
            >
                Dismiss
            </button>
        </div>
    </div>
)

interface PlotProps {
    parameters: string[] | null,
    loadDone?: boolean,
    style?: React.CSSProperties,
    isStale?: boolean,
    staleSeconds?: number,
    dismissed?: boolean,
    onDismiss?: () => void,
}
/**
 * A React forwardRef component that renders a plot with an optional header and a loading indicator.
 *
 * @param props - The properties passed to the component.
 * @param props.loadDone - A boolean indicating if the plot has finished loading.
 * @param props.parameters - An array of parameters to be displayed in the plot header.
 * @param props.style - An optional style object to customize the style of the plot container.
 * @param ref - A ref object to access the inner div element.
 *
 * @returns A JSX element representing the plot.
 */
const Plot = forwardRef((props: PlotProps, ref: React.Ref<HTMLDivElement>) => {

    const load = props.loadDone ? null : <Loader text="Loading plot..." />

    const dash = props.parameters
        ? <PlotHeaderDash
            params={Array(...new Set([...props.parameters, ...plotHeaderDefaults]))}
        />
        : null

    const style: React.CSSProperties = props.style || {
        top: "0px",
        left: "0px",
        right: "0px",
        bottom: "0px",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
    }

    const showStale = props.isStale && !props.dismissed

    return (
        <div style={style}>
            {dash}
            <div ref={ref} style={{
                width: "100%",
                height: "100%",
            }}>{load}</div>
            {showStale && <StaleOverlay staleSeconds={props.staleSeconds ?? 0} onDismiss={props.onDismiss ?? (() => {})} />}
        </div>
    )
})

interface SimplePlotProps {
    params: string[],
    style?: any,
}
/**
 * A functional component that renders a simple plot using the provided parameters.
 * A simple plot is a single timeseries plot with no header, showing the last 5 minutes
 * of data.
 * 
 * @param {SimplePlotProps} props - The properties for the SimplePlot component.
 * @param {Object} props.params - The parameters for the plot.
 * @param {Object} props.style - Optional custom styles for the plot container.
 * 
 * @returns A div element that contains the plot.
 */
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
        mask: false
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
/**
 * PlotDispatcher component is responsible for rendering a plot with the given options and props.
 * It uses various hooks to manage the plot options, loading state, and dispatching actions.
 *
 * @param {PlotDispatcherProps} [props] - The properties passed to the PlotDispatcher component.
 * @returns The rendered Plot component or an empty fragment if options or props are not provided.
 *
 * @component
 * @example
 * return (
 *   <PlotDispatcher 
 *     containerStyle={{ width: '100%', height: '400px' }} 
 *     someOtherProp={value} 
 *   />
 * )
 *
 * @remarks
 * This component uses the following hooks:
 * - `useRef` to create a reference to the plot container div.
 * - `usePlotOptions` to generate plot options based on the provided props.
 * - `usePlot` to manage the plot loading state.
 * - `useDispatch` to dispatch actions to the Redux store.
 * - `useEffect` to handle side effects related to the plot options and dispatch actions.
 *
 * The component dispatches the following actions:
 * - `setQuickLookMode` to toggle quick look mode based on the presence of a job in the options.
 * - `setQcJob` to set the QC job in the Redux store.
 *
 * The component conditionally renders the Plot component with the appropriate parameters and styles.
 */
const PlotDispatcher = (props?: PlotDispatcherProps) => {

    const ref = useRef<HTMLDivElement>(null)
    const options = usePlotOptions(props);
    const { loadDone, isStale, staleSeconds } = usePlot(options, ref)
    const dispatch = useDispatch()
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        const job = options?.job
        if (!job) {
            dispatch(setQuickLookMode(false))
            return
        }
        dispatch(setQcJob(job))
        dispatch(setQuickLookMode(true))
    }, [options?.job, dispatch, setQcJob, setQuickLookMode])

    // Reset dismissed state when data recovers so the overlay re-appears on the next stale episode
    useEffect(() => {
        if (!isStale) setDismissed(false)
    }, [isStale])

    if (!options) return <></>
    if (!props) return <></>

    const headerParams = options.header
        ? options.params
        : null

    return <Plot ref={ref}
        parameters={headerParams}
        loadDone={loadDone}
        style={props.containerStyle}
        isStale={isStale}
        staleSeconds={staleSeconds}
        dismissed={dismissed}
        onDismiss={() => setDismissed(true)}
    />
}

export default PlotDispatcher
export { SimplePlot, Plot }