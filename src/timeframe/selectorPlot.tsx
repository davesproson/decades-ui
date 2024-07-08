import { useRef } from 'react'
import { useSelectorPlot } from './hooks'
import { PlotlyHTMLDivElement } from './timeframe.types'

/**
 * This component displays a Plotly plot with a range selector. It displays the
 * flight's altitude, and the range slider allows the user to select a
 * custom timeframe.
 */
const SelectorPlot = () => {
    const ref = useRef<PlotlyHTMLDivElement>(null)
    const gotData = useSelectorPlot(ref)

    if(!gotData) return (
        <div className="notification is-info">
            <p>Loading altitude trace...</p>
        </div>
    )
    return <div ref={ref} style={{height:"200px"}} />
}

export { SelectorPlot }