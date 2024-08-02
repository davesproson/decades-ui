import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DecadesBreadCrumb } from '@/components/ui/breadcrumb'
import Navbar from '@/navbar'
import { useSelector } from '@store'
import { Clock } from 'lucide-react'
import { TimeframeSelectorPlot } from './timeframe-chart'
import { TimeframeSelectCard } from './timeframe-select'
import { FlightSummarySelector } from './flightsummary'
import { ParameterDispatcher } from '@/parameters/parameter-dispatcher'
import { LiveDataOnly } from '@/components/flow'

const TimeframeInfoBox = () => {
    const useCustomTimeframe = useSelector(state => state.options.useCustomTimeframe)
    const customTimeframe = useSelector(state => state.options.customTimeframe)
    const timeframes = useSelector(state => state.options.timeframes)
    const timeframe = timeframes.find(x => x.selected)

    const padNum = (num: number) => {
        return num.toString().padStart(2, "0")
    }

    const timeString = (time: number) => {
        const date = new Date(time)
        const hours = padNum(date.getUTCHours())
        const minutes = padNum(date.getUTCMinutes())
        const seconds = padNum(date.getUTCSeconds())
        return `${hours}:${minutes}:${seconds}`
    }

    let text = ""
    if (useCustomTimeframe) {

        const startStr = timeString(customTimeframe.start || 0)
        text += `From ${startStr} `

        if (customTimeframe.end) {
            const endStr = timeString(customTimeframe.end)
            text += `to ${endStr}`
        } else {
            text += `and ongoing`
        }
    } else {
        if (timeframe) {
            text += `Last ${timeframe.label} and ongoing`
        }
    }

    return (
        <Alert>
            <div className="flex">
                <Clock size={36} className="mr-2" />
                <div>
                    <AlertTitle>Timeframe</AlertTitle>
                    <AlertDescription>
                        {text}
                    </AlertDescription>
                </div>
            </div>
        </Alert>
    )
}

function Timeframe() {

    return (
        <Navbar>
            <ParameterDispatcher>
                <DecadesBreadCrumb crumbs={[
                    { label: 'Timeframe' },
                ]} />

                <TimeframeInfoBox />
                <TimeframeSelectorPlot />
                <TimeframeSelectCard />
                <LiveDataOnly>
                    <FlightSummarySelector />
                </LiveDataOnly>
            </ParameterDispatcher>
        </Navbar>
    )
}

export { Timeframe }
