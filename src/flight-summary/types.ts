export type FlightSummaryPoint = {
    time: number,
    latitude: number,
    longitude: number,
    altitude: number,
    heading: number,
}

export type FlightSummaryEntry = {
    uuid: number,
    event: string,
    modified: number,
    start: FlightSummaryPoint,
    stop: Partial<FlightSummaryPoint>,
    ongoing: boolean,
    comment: string | null,
    deleted?: boolean
}

export type FlightSummary = {
    [key: string]: FlightSummaryEntry
}