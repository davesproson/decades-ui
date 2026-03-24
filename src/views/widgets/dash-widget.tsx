import React, { useImperativeHandle, useMemo } from 'react'
import { useSelector } from '@store'
import { Badge } from '@/components/ui/badge'
import { ConfigHandle, ConfigWidgetProps, RegistryType, WidgetConfiguration } from './types'
import { Redash } from '@/dashboard/dashboard'
import dashboardIcon from '@/assets/view-icons/dashboard.svg'


type ConfigDashboardData = {
    params: string[],
    limits: string[]
}
type DashboardProps = any

/**
 * Add a dashboard to the advanced view. It's a forwardRef which uses an
 * imperative handle to get the data back out. The current dashboard
 * configuration is used, and is simply displayed to the user here.
 * 
 * @param {*} props - the react props
 * @param {*} ref - the react ref
 * 
 * @component
 */
const ConfigDashboardArea = React.forwardRef<ConfigHandle<ConfigDashboardData>, {}>((_props, ref) => {
    const paramOptions = useSelector(state => state.vars)

    const paramList = paramOptions.params.filter(x => x.selected).map(x => {
        return <Badge is="info" className={"mr-1"} >{x.raw}</Badge>
    })

    useImperativeHandle(ref, () => {
        return {
            getData: () => {
                return {
                    params: paramOptions.params.filter(x => x.selected).map(x => x.raw),
                    limits: []
                }
            }
        }
    }, [paramOptions])

    return (
        <div className="mt-2">
            <p>Add a dashboard to the to the view, with the currently selected set of
                parameters.</p>
            <p className="mt-2">
                Currently selected parameters are: {paramList}
            </p>
        </div>
    )
})

const useDashWidget = (registry: RegistryType<WidgetConfiguration>) => {
    const ref = React.useRef<ConfigHandle<ConfigDashboardData>>(null)
    const widget = useMemo(() => ({
        name: "Dash",
        type: "dashboard",
        configComponent: <ConfigDashboardArea ref={ref} />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "dashboard",
                size: "large",
                ...ref.current?.getData()
            })
            return true
        },
        icon: dashboardIcon,
        tooltip: 'Display a dashboard - realtime parameter values',
        component: (props: DashboardProps) => {
            return <Redash {...props} useURL={false} />
        }
    }), []) // ref is stable — no deps needed
    registry.register(widget)
}

export { useDashWidget }