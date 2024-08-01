import { FlightSummaryEntry } from "../types";

export const testEntry: FlightSummaryEntry = {
    event: "Test Event",
    uuid: 1234,
    deleted: false,
    ongoing: false,
    modified: 1234,
    start: {
        time: 0,
        latitude: 54.5,
        longitude: 1.5,
        altitude: 1000.43,
        heading: 180.4,
    },
    stop: {
        time: 1000,
        latitude: 55.5,
        longitude: 2.5,
        altitude: 2000.234,
        heading: 270.33,
    },
    comment: "Test Comment",
} 