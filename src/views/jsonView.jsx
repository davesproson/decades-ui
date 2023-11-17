import noscroll from "../../assets/css/no-scroll.css"

import { VistaErrorBoundary } from '../components/error'
import PlotDispatcher  from '../plot/plot'
import Dashboard  from '../dashboard/dashboard'
import Tephigram from '../tephigram/tephigram'
import AlarmList from '../alarms/alarm'
import Timers from '../timers/timer'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { libraryViews } from './libraryEntries'

const UrlView = (props) => {
    return (
        <iframe src={props.url} frameBorder="0" scrolling="no"
             style={{border: "none", overflow: "hidden", width: "100%", height: "100%"}}/>
            
    )
}

const _View = (props) => {

    useEffect(()=>{
        if(!props.top) return
        document.title = props.title || 'DECADES View'
    }, [])

    const elements = props.elements

    const getRowColPercent = (i) => {
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
        width: props.top ? "100vw" : null, //"100cw",
        height: props.top ? "100vh" : null //"100ch"
    }

    return (
        
        <div style={style}>
            {elements.map((element, i) => {
                const Element = getElement.get(element.type) 
                return (
                    <div key={i} style={{display: "grid"}}>
                        
                        <Element  {...element} />
                    </div>
                )
            })}
        </div>
        
    )

}

const plotStyle = {
    width: "100%",
    height: "100%",
    position: "relative"
}

const getElement = new Map([
    ['plot', (props) => PlotDispatcher({...props, style: plotStyle})],
    ['tephi', (props) => Tephigram({...props, style: plotStyle})],
    ['view', _View],
    ['dashboard', (props) => Dashboard({...props, useURL: false})],
    ['url', UrlView],
    ['alarms', AlarmList],
    ['timers', (props) => Timers(props)]
])

const JsonView = (props) => {
    let cfg = props.cfg || JSON.parse(localStorage.getItem('viewConfig'))
    const [searchParams] = useSearchParams()
    const viewName = searchParams.get('view')

    const v3Views = libraryViews.filter(v => v.config.version === 3)
    const v3View = v3Views.find(v => v.title === viewName)
    if(v3View) {
        cfg = v3View.config
        if(!cfg.title) cfg.title = v3View.title
    }

    useEffect(()=>{
        document.getElementsByTagName('html')[0].style.overflow = "hidden"
    }, [])

    return (
        <VistaErrorBoundary errorMessage={"View may be misconfigured"}>
            <_View {...cfg} top={true} />
        </VistaErrorBoundary>
    )
}

export default JsonView
