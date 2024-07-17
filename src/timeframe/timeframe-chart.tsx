import { useRef } from 'react'
import { useSelectorPlot } from './hooks'
import { PlotlyHTMLDivElement } from './types'
import { Hourglass } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

/**
 * This component displays a Plotly plot with a range selector. It displays the
 * flight's altitude, and the range slider allows the user to select a
 * custom timeframe.
 */
const TimeframeSelectorPlot = () => {
    const ref = useRef<PlotlyHTMLDivElement>(null)
    const gotData = useSelectorPlot(ref)

    if(!gotData) return (
        <Alert className="mt-2">
        <Hourglass className="h-4 w-4" />
        <AlertTitle>Loading altitude data...</AlertTitle>
      </Alert>
    )
    return  (
        <Card className="mt-2">
            <CardContent>
                <div ref={ref} style={{height:"200px"}} />
            </CardContent>
        </Card>
    )
}

export { TimeframeSelectorPlot }