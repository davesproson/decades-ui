import { useState, useEffect } from 'react';
import { apiEndpoints } from '../settings';

import { FlightSummaryEntry } from '../timeframe/timeframe.types'

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