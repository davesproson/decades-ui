import { Badge } from "@/components/ui/badge"
import PlotDispatcher from "@/plot/plot"
import type { PlotURLOptions } from "@/plot/types"
import { getAxesArray } from "@/plot/utils"
import { useSelector } from "@store"
import { forwardRef, useImperativeHandle, useRef } from "react"
import type { ConfigHandle, ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./types"
import { containerStyle } from "./utils"
import chartIcon  from "@/assets/view-icons/chart.svg"

type ConfigPlotData = {
    params: string[],
    axes: string[],
    timeframe: string,
    plotStyle: string,
    scrolling: boolean,
    header: boolean,
    ordvar: string,
    swapxy: boolean,
    server?: string
}

const BooleanBadge = ({ value }: { value: boolean }) => {
    return <Badge>{value ? 'Yes' : 'No'}</Badge>
}

const ConfigPlotArea = forwardRef<ConfigHandle<ConfigPlotData>, {}>((_props, ref) => {

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
                    server: options.server
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

const usePlotWidget = (registry: RegistryType<WidgetConfiguration>) => {
    const ref = useRef<ConfigHandle<ConfigPlotData>>(null)
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
