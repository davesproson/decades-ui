export type FlightSummaryEntry = {
    uuid: number,
    event: string,
    modified: number,
    start: {
        time: number,
        latitude: number,
        longitude: number,
        altitude: number,
        heading: number,
    },
    stop: {
        time?: number,
        latitude?: number,
        longitude?: number,
        altitude?: number,
        heading?: number,
    },
    ongoing: boolean,
    comment: string | null,
    deleted?: boolean
}

export type FlightSummary = {
    [key: string]: FlightSummaryEntry
}