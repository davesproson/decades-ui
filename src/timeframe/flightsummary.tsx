import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFlightSummary } from './hooks'
import { FlightSummaryEntry, FlightSummaryEntryProps } from './types'
import { useDispatch } from '@store'
import { setCustomTimeframe } from '@/redux/optionsSlice'
import { Button } from '@/components/ui/button'
import { Circle, MoveRight, MoveUpRight } from 'lucide-react'

const FlightSummaryEntrySelector = (props: FlightSummaryEntryProps) => {
    const dispatch = useDispatch()

    const setTimeframe = (start: number, end: number) => {
        dispatch(setCustomTimeframe({start: start, end: end}))
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
        if(isRun) {
            return "text-green-600"
        }
        if(isProfile) {
            return "text-blue-400"
        }
        if(isOrbit) {
            return "text-pink-600"
        }
        return ""
    })()

    const icon = (() => {
        if(isOrbit) {
            return <Circle size={16} className="mr-2"/>
        }
        if(isRun) {
            return <MoveRight size={16} className="mr-2"/>
        }
        if(isProfile) {
            return <MoveUpRight size={16} className="mr-2"/>
        }
        return null
    })()

    return (
        <Button variant="ghost" className={tagStyle} onClick={()=>setTimeframe(fromMs, toMs)}>
           {icon} <strong className="mr-2">{props.entry.event}:</strong> from {from} until {to}
        </Button>
    )
}

const FlightSummarySelector = () => {
    const fs = useFlightSummary()

    const filterFlightSummary = (fs: Array<FlightSummaryEntry>) => {
        if(!fs) {
            return []
        }
        const asArray = Object.values(fs).sort(x=>-x?.start?.time)
        
        return asArray.filter(x=>x?.start?.time && x?.stop?.time)     
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
                    <FlightSummaryEntrySelector id={i} entry={x}/>
                </li>)
            )}
            </ul>
        </CardContent>
    </Card>
    )
}

export { FlightSummarySelector }