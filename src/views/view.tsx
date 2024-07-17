import { VistaErrorBoundary } from '@/components/errors'
import { useEffect, useState } from 'react'
import { libraryViews } from './library-entries'

import { Version3LibraryView, Version3ViewElement } from "./types"
import Loader  from "@/components/loader"
import { _View } from "./widgets/view-widget"
import { useScrollInhibitor } from '@/hooks'
import { Route } from "@/routes/view"

const ViewBuilder = () => {
    const [config, setConfig] = useState<Version3ViewElement>()
    useScrollInhibitor(true)
    const { view: viewName } = Route.useSearch()

    useEffect(()=>{
        document.getElementsByTagName('html')[0].style.overflow = "hidden"
    }, [])
    
    useEffect(()=>{
        let config
        
        try {
            config = JSON.parse(localStorage.getItem('viewConfig') || '') as Version3ViewElement
        } catch(e) {
            console.log('No view config found in local storage')
        }

        if(viewName) {
            const v3Views = libraryViews.filter(v => v.config.version === 3)
            if(v3Views.length === 0) throw new Error("No views found")

            const v3View = v3Views.find(v => v.title === viewName) as Version3LibraryView
            if(!v3View) throw new Error(`View ${viewName} not found`)
            
            config = v3View.config
            if(!config.title) config.title = v3View.title

            console.log(config)
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

export default ViewBuilder