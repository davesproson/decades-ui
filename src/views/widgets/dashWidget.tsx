import React, { useImperativeHandle } from 'react'
import { useSelector } from '../../redux/store'
import { useLocalStorage } from 'usehooks-ts'
import { Tag } from '../../components/tags'
import { ConfigHandle, ConfigWidgetProps, RegistryType, WidgetConfiguration } from './widgets.types'
import { DashboardProps } from '../../dashboard/dashboard.types'
import { Dashboard } from '../../dashboard/dashboard'
import { Redash } from '../../redash/redash'


type ConfigDashboardData = {
    params: string[],
    limits: string[]
}

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
        return <Tag text={x.raw} is="info" extraClasses={"mr-1"} />
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
    const useNewDashboard = useLocalStorage<boolean>('useNewDashboard', false)[0]

    registry.register({
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
        icon: 'dashicons/dashboard.svg',
        tooltip: 'Display a dashboard - realtime parameter values',
        component: (props: DashboardProps) => {
            if(useNewDashboard) {
                return <Redash {...props} useURL={false} />
            }
            return <Dashboard {...props} useURL={false} />
        }
    })
}

export { useDashWidget }