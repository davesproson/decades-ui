import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { apiEndpoints } from "../settings"
import type { FlightSummary } from "./types"
import { useLoaderData } from "@tanstack/react-router"

/**
 * Get the flight summary data from the API. Optionally set the returned data 
 * to a state variable.
 * 
 * @param setter - Optional state setter function
 * @returns - The flight summary data
 */
const getFlightSummary = async (setter?: Dispatch<SetStateAction<FlightSummary|undefined>>) => {
    try {
        const data = await fetch(apiEndpoints.flightsummary)
        const json = await data.json()
        if (setter) setter(json)
        return json satisfies FlightSummary
    } catch(e) {
        return {} satisfies FlightSummary
    }

}

/**
 * Custom hook to get the flight summary data from the API. This hook will 
 * automatically update the data every 5 seconds, getting the initial data
 * from the loader.
 * 
 * @returns - The flight summary data
 */
const useFlightSummary = () => {
    const [data, setData] = useState<FlightSummary>()
    let loaderData: FlightSummary | undefined
    try {
        loaderData = useLoaderData({from: '/flight-summary/'}) satisfies FlightSummary
    } catch {
        loaderData = undefined
    }
    
    // Update the data every 5 seconds
    useEffect(() => {
        if(loaderData===undefined) {
            getFlightSummary(setData)
        }
        const interval = setInterval(() => getFlightSummary(setData), 5000)
        return () => clearInterval(interval)
    }, [setData])

    // If the data has not been set yet, return the loader data
    return data === undefined ? loaderData : data
}

export { useFlightSummary, getFlightSummary }