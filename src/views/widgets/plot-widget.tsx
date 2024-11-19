import { Badge } from "@/components/ui/badge"
import PlotDispatcher from "@/plot/plot"
import type { PlotInternalOptions, PlotURLOptions } from "@/plot/types"
import { getAxesArray } from "@/plot/utils"
import { useSelector } from "@store"
import { forwardRef, useImperativeHandle, useRef } from "react"
import type { ConfigHandle, ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./types"
import { containerStyle } from "./utils"
import chartIcon  from "@/assets/view-icons/chart.svg"

/**
 * A functional component that renders a badge with a text "Yes" or "No" 
 * based on the boolean value passed as a prop.
 *
 * @param {Object} props - The props object.
 * @param {boolean} props.value - The boolean value to determine the badge text.
 * @returns A Badge component with the text "Yes" if the value is true, otherwise "No".
 */
const BooleanBadge = ({ value }: { value: boolean }) => {
    return <Badge>{value ? 'Yes' : 'No'}</Badge>
}

/**
 * ConfigPlotArea Component
 * 
 * This component is responsible for configuring and displaying the plot area settings.
 * It uses React's `forwardRef` to expose a method for retrieving the current plot configuration.
 * The component utilizes Redux selectors to fetch the current plot options and parameter options from the state.
 * 
 * The component performs the following tasks:
 * - Retrieves the current plot configuration options and parameter options from the Redux store.
 * - Converts the parameter options into an array of axis strings.
 * - Exposes a method `getData` via `useImperativeHandle` to return the current plot configuration data.
 * - Configures the timeframe string based on the selected timeframe or custom timeframe.
 * - Configures the parameter list to display selected parameters as badges.
 * - Renders a summary of the current plot configuration including timeframe, parameters, style, ordinate variable, axis swap, and scrolling options.
 * 
 * @component
 * @example
 * const ref = useRef();
 * <ConfigPlotArea ref={ref} />
 * 
 * @returns {JSX.Element} A JSX element displaying the current plot configuration.
 */
const ConfigPlotArea = forwardRef<ConfigHandle<PlotInternalOptions>, {}>((_props, ref) => {

    // Get the current plot configuration
    const options = useSelector(state => state.options)
    const paramOptions = useSelector(state => state.vars)

    // Get the axes array representation
    const axesStrings = getAxesArray(paramOptions)

    // Return the data to the parent
    useImperativeHandle(ref, () => {
        return {
            getData: () => {
                return {
                    params: paramOptions.params.filter(x => x.selected).map(x => x.raw),
                    axes: axesStrings,
                    // TODO: Implement custom timeframes? Is it worth it?
                    timeframe: options.timeframes.filter(x => x.selected)[0]?.value || "30min",
                    plotStyle: options.plotStyle.value,
                    scrolling: options.scrollingWindow,
                    header: options.dataHeader,
                    ordvar: options.ordinateAxis,
                    swapxy: options.swapOrientation,
                    server: options.server,
                    mask: options.mask
                }
            }
        }
    }, [options, paramOptions])

    // Configure the timeframe string
    let timeframe
    try {
        timeframe = options.timeframes.filter(x => x.selected)[0].label
    } catch (e) {
        if (options.useCustomTimeframe) {
            timeframe = `Custom [NOT SUPPORTED]`
        }
    }

    // Configure the parameter string
    const paramList = paramOptions.params.filter(x => x.selected).map(x => {
        return <Badge key={x.raw} >{x.raw}</Badge>
    })

    return (
        <div className="mt-2">
            Add a plot to the dashboard. The plot currently configured is
            <ul className="mt-2">
                <li><strong>Timeframe</strong>: <Badge>{timeframe}</Badge></li>
                <li><strong>Parameters</strong>:  {paramList}</li>
                <li><strong>Style</strong>: <Badge>{options.plotStyle.value}</Badge></li>
                <li><strong>Ordinate var</strong>: <Badge>{options.ordinateAxis}</Badge></li>
                <li><strong>Swap x & y axes?</strong>: <BooleanBadge value={options.swapOrientation} /></li>
                <li><strong>Scrolling?</strong>: <BooleanBadge value={options.scrollingWindow} /></li>
            </ul>
        </div>
    )
})

/**
 * Custom hook to register a Plot widget in the provided registry.
 *
 * @param {RegistryType<WidgetConfiguration>} registry - The registry where the Plot widget will be registered.
 *
 * @example
 * const registry = useRegistry();
 * usePlotWidget(registry);
 *
 * @remarks
 * This hook creates a Plot widget plugin with a configuration component, save functionality, icon, tooltip, and main component.
 * The configuration component uses a ref to manage internal options and save data.
 */
const usePlotWidget = (registry: RegistryType<WidgetConfiguration>) => {
    const ref = useRef<ConfigHandle<PlotInternalOptions>>(null)
    const plugin = {
        name: "Plot",
        type: "plot",
        configComponent: <ConfigPlotArea ref={ref} />,
        save (props: ConfigWidgetProps) {
            props.setData({
                type: "plot",
                ...ref.current?.getData()
            })
            return true
        },
        icon: chartIcon,
        tooltip: 'Display a timeseries plot',
        component: (props: PlotURLOptions) => PlotDispatcher({ ...props, containerStyle: containerStyle }),
    }
    registry.register(plugin)
}

export { usePlotWidget }
