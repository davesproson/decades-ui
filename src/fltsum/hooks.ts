import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { apiEndpoints } from "../settings"

const getData = (setter: Dispatch<SetStateAction<FlightSummary|undefined>>) => {
    fetch(apiEndpoints.flightsummary).then(
        response => response.json()
    ).then(
        data => setter(data)
    )

}

const useFlightSummary = () => {
    const [data, setData] = useState<FlightSummary>()

    useEffect(() => {
        getData(setData)
        const interval = setInterval(() => getData(setData), 5000)
        return () => clearInterval(interval)
    }, [setData, getData])

    return data
}

export { useFlightSummary }