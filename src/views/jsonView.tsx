import "../../assets/css/no-scroll.css"

import { VistaErrorBoundary } from '../components/error'
import PlotDispatcher  from '../plot/plot'
import Dashboard  from '../dashboard/dashboard'
import Tephigram from '../tephigram/tephigram'
import AlarmList from '../alarms/alarm'
import Timers from '../timers/timer'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { libraryViews } from './libraryEntries'
import { PlotURLOptions } from "../plot/plot.types"
import { TephigramOptions } from "../tephigram/tephigram.types"
import { DashboardProps } from "../dashboard/dashboard.types"
import { TimerConfig } from "../timers/timers.types"
import { Version3LibraryView, Version3ViewElement } from "./views.types"
import { Loader } from "../components/loader"
import { GaugePanel } from "../gauge/gauge"
import { HeadingIndicator } from "../heading/heading"

const UrlView = (props: {url: string}) => {
    return (
        <iframe src={props.url} frameBorder="0" scrolling="no"
             style={{border: "none", overflow: "hidden", width: "100%", height: "100%"}}/>
            
    )
}

interface ViewProps {
    title?: string,
    rowPercent: number[],
    columnPercent: number[],
    elements: any[],
    top: boolean
}
const _View = (props: ViewProps) => {

    useEffect(()=>{
        if(!props.top) return
        document.title = props.title || 'DECADES View'
    }, [])

    const elements = props.elements

    const getRowColPercent = (i: 'rowPercent' | 'columnPercent'): string => {
        try {
            return props[i].map(x=>`${x}%`).join(" ")
        } catch (e) {
            return "100%"
        }
    }

    const style = {
        display: "grid",
        gridTemplateRows: getRowColPercent("rowPercent"),
        gridTemplateColumns: getRowColPercent("columnPercent"),
        width: props.top ? "100vw" : undefined, 
        height: props.top ? "100vh" : undefined 
    }

    return (
        
        <div style={style}>
            {elements.map((element, i) => {
                const Element = getElement[element.type]
                return (
                    <div key={i} style={{display: "grid"}}>  
                        <Element  {...element} />
                    </div>
                )
            })}
        </div>
        
    )

}

const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative"
}
 
// This should be a map, but TS was bitching about it. Lazy fix FTW.
const getElement: {[key: string]: (props: any)=>React.JSX.Element} = {
    'plot': (props: PlotURLOptions) => PlotDispatcher({...props, containerStyle: containerStyle}),
    'tephi': (props: TephigramOptions) => Tephigram({...props, containerStyle: containerStyle}),
    'dashboard': (props: DashboardProps) => Dashboard({...props, useURL: false}),
    'view': _View,
    'url': UrlView,
    'alarms': AlarmList,
    'timers': (props: {initialTimers: Array<TimerConfig>}) => Timers(props),
    'gauge': (props: any) => GaugePanel({...props}),
    'heading': HeadingIndicator
}

const JsonView = () => {
    const [searchParams] = useSearchParams()
    const [config, setConfig] = useState<Version3ViewElement>()

    useEffect(()=>{
        document.getElementsByTagName('html')[0].style.overflow = "hidden"
    }, [])
    
    useEffect(()=>{
        let config = (
            JSON.parse(localStorage.getItem('viewConfig') || '') as Version3ViewElement
        )

        const viewName = searchParams.get('view')

        if(viewName) {
            const v3Views = libraryViews.filter(v => v.config.version === 3)
            if(v3Views.length === 0) throw new Error("No views found")

            const v3View = v3Views.find(v => v.title === viewName) as Version3LibraryView
            if(!v3View) throw new Error(`View ${viewName} not found`)
            
            config = v3View.config
            if(!config.title) config.title = v3View.title
        }

        setConfig(config)
    }, [])

    const view = config 
        ? <_View {...config} top={true} /> 
        : <Loader text={"Loading view..."} />

    return (
        <VistaErrorBoundary errorMessage={"View may be misconfigured"}>
            {view}
        </VistaErrorBoundary>
    )
}

export default JsonView
