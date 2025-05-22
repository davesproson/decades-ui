import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { useFlightSummary } from './hooks'
import { useFlightSummary } from '@/flight-summary/hooks'
import { FlightSummaryEntry, FlightSummaryEntryProps } from './types'
import { FlightSummary } from '@/flight-summary/types'
import { useDispatch } from '@store'
import { setCustomTimeframe } from '@/redux/optionsSlice'
import { Button } from '@/components/ui/button'
import { Circle, MoveRight, MoveUpRight } from 'lucide-react'

const FlightSummaryEntrySelector = (props: FlightSummaryEntryProps) => {
    const dispatch = useDispatch()

    const setTimeframe = (start: number, end: number) => {
        dispatch(setCustomTimeframe({ start: start, end: end }))
    }

    const formatTime = (time: number) => {
        const date = new Date(time)
        return date.toLocaleTimeString()
    }

    const fromMs = props.entry.start.time * 1000
    const toMs = props.entry.stop.time * 1000
    const from = formatTime(fromMs)
    const to = formatTime(toMs)

    const isRun = props.entry.event.startsWith("Run")
    const isProfile = props.entry.event.startsWith("Profile")
    const isOrbit = props.entry.event.startsWith("Orbit")

    const tagStyle = (() => {
        if (isRun) {
            return "text-green-600"
        }
        if (isProfile) {
            return "text-blue-400"
        }
        if (isOrbit) {
            return "text-pink-600"
        }
        return ""
    })()

    const icon = (() => {
        if (isOrbit) {
            return <Circle size={16} className="mr-2" data-testid="fs-orbit-icon" />
        }
        if (isRun) {
            return <MoveRight size={16} className="mr-2" data-testid="fs-run-icon" />
        }
        if (isProfile) {
            return <MoveUpRight size={16} className="mr-2" data-testid="fs-profile-icon" />
        }
        return null
    })()

    return (
        <Button variant="ghost" className={tagStyle} onClick={() => setTimeframe(fromMs, toMs)}>
            {icon} <strong className="mr-2"><span>{props.entry.event}</span>:</strong> from {from} until {to}
        </Button>
    )
}

const FlightSummarySelector = () => {
    const fs = useFlightSummary()

    const filterFlightSummary = (fs: FlightSummary | undefined) => {
        const arrFs = Object.values(fs || {})
        if (!arrFs) {
            return []
        }
        const asArray = Object.values(arrFs).sort(x => -x?.start?.time)

        // Need the manual type assertion here because the filter function
        // is not smart enough to know that the filter function will remove
        // all undefined values
        return asArray.filter(x => (x?.start?.time && x?.stop?.time && !x.deleted)) as FlightSummaryEntry[]
    }

    const filtered = filterFlightSummary(fs)

    return (
        <Card className="mt-2">
            <CardHeader>
                <CardTitle>
                    Flight Summary
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {filtered.map((x, i) => (
                        <li key={i}>
                            <FlightSummaryEntrySelector id={i} entry={x} />
                        </li>)
                    )}
                </ul>
            </CardContent>
        </Card>
    )
}

export { FlightSummarySelector }