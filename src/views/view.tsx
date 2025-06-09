import { VistaErrorBoundary } from '@/components/errors'
import { useEffect, useState } from 'react'
import { libraryViews } from './library-entries'

import { Version3LibraryView, Version3ViewElement } from "./types"
import Loader from "@/components/loader"
import { _View } from "./widgets/view-widget"
import { useScrollInhibitor } from '@/hooks'
import { Route } from "@/routes/view"

const ViewBuilder = () => {
    const [config, setConfig] = useState<Version3ViewElement>()
    useScrollInhibitor(true)
    const { view: viewName } = Route.useSearch()

    // Disable scroll on the html element to prevent background scrolling. 
    // Views are designed to be full screen and should not allow scrolling of the background.
    useEffect(() => {
        document.getElementsByTagName('html')[0].style.overflow = "hidden"
    }, [])

    // Load the view configuration from session storage or from the library views
    useEffect(() => {
        // Parse the view name from the search params
        // Replace '+' with ' ' to match the view titles in the library
        const parsedViewName = viewName ? viewName.split("+").join(" ") : undefined

        let storedConfigs: { [key: string]: Version3ViewElement | undefined } = {}
        let jsonConfig: Version3ViewElement | undefined = undefined

        // If no view name is provided, log an error and return
        if (!parsedViewName) {
            console.error("No view name provided in search params")
            return
        }

        // Try to load the view configuration from session storage. If it exists, use it.
        // If it doesn't exist, load the view configuration from the library views.
        try {
            storedConfigs = JSON.parse(sessionStorage.getItem('viewConfig') || '')
            if (parsedViewName in storedConfigs) {
                jsonConfig = storedConfigs[parsedViewName] as Version3ViewElement
                setConfig(jsonConfig)
                return
            }
        } catch (e) {
            console.log('No view config found in session storage')
        }

        // If the view configuration is not found in session storage, load it from the
        // library views. Filter the library views to find the one with the matching title.

        const v3Views = libraryViews.filter(v => v.config.version === 3)
        if (v3Views.length === 0) throw new Error("No views found")

        const v3View = v3Views.find(v => v.title === parsedViewName) as Version3LibraryView
        if (!v3View) throw new Error(`View ${parsedViewName} not found`)

        jsonConfig = v3View.config
        if (!jsonConfig.title) jsonConfig.title = v3View.title

        setConfig(jsonConfig)
    }, [viewName, setConfig])

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