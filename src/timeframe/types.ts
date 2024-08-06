import { FlightSummaryEntry as RetreivedFlightSummaryEntry, FlightSummaryPoint } from "@/flight-summary/types"

interface FlightSummaryEntry extends RetreivedFlightSummaryEntry { 
    stop: FlightSummaryPoint,
}

interface FlightSummaryEntryProps {
    id?: any,
    entry: FlightSummaryEntry
}

type PlotlyHTMLDivElement = HTMLDivElement & { 
    on: (cb: string, e:any)=>{},
    removeAllListeners: (listener: string) => void,
}

export type { FlightSummaryEntryProps, FlightSummaryEntry, PlotlyHTMLDivElement }
