interface FlightSummaryEntry {
    start: {
        time: number
    },  
    stop: {
        time: number
    },  
    event: string
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
