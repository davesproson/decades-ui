import "../../assets/css/no-scroll.css"

import { VistaErrorBoundary } from '../components/error'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { libraryViews } from './libraryEntries'

import { Version3LibraryView, Version3ViewElement } from "./views.types"
import { Loader } from "../components/loader"
import { _View } from "./widgets/viewWidget"

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
