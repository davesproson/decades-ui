import { useState, useEffect } from 'react';
import { apiEndpoints } from '../settings';

import { FlightSummaryEntry } from '../timeframe/timeframe.types'

/**
 * This hook fetches the flight summary data from the API and updates the 
 * state with the new data every 15 seconds.
 * 
 * @returns the current flight summary data
 * 
 */
const useFlightSummary = () => {
    const [flightSummary, setFlightSummary] = useState<Array<FlightSummaryEntry>>([]);

    const getFlightSummary = () => {
        fetch(apiEndpoints.flightsummary)
            .then(response => response.json())
            .then(data => setFlightSummary(data))
            .catch(e=>{
                console.log("Error fetching flight summary", e);
            })
    }

    useEffect(() => {
        getFlightSummary();
        const interval = setInterval(getFlightSummary, 15000)
        return () => clearInterval(interval)
    }, []);

    return flightSummary;
}

export { useFlightSummary }