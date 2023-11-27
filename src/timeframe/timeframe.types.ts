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

export type { FlightSummaryEntryProps, FlightSummaryEntry }