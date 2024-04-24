import { DataContext } from './context';
import { ddToDmm, metresToFeet, msToKnots, getFlightNumber } from '../utils';
import { useContext, useEffect, useState } from 'react';

type HeaderElementProps = {
    title?: string,
    value: string,
    unit?: string,
}
const HeaderElement = ({ title, value, unit }: HeaderElementProps) => {
    const TitleElement = () => title ? <p className="heading">{title}</p> : null
    const UnitElement = () =>unit ? <p className="heading">{unit}</p> : null
    const ValueElement = () => <p className="title">{value}</p>

    return (
        <div className="level-item has-text-centered">
            <div>
                <TitleElement />
                <ValueElement />
                <UnitElement />
            </div>
        </div>
    )
}

const MapHeader = ({show}: {show: boolean}) => {
    const { aircraftData } = useContext(DataContext)
    const [ flightNumber, setFlightNumber ] = useState<string>('----')
    
    useEffect(() => {
        const updateFlightNumber = () => getFlightNumber().then(x=>setFlightNumber(x))
        updateFlightNumber()
        const interval = setInterval(() => {
            updateFlightNumber()
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    const lat = ddToDmm(aircraftData.lat, ['North', 'South'])
    const lon = ddToDmm(aircraftData.lon, ['East', 'West'])
    const alt = metresToFeet(aircraftData.alt || 0).toFixed(0)
    const heading = Math.floor(aircraftData.heading || 0).toString().padStart(3, '0')
    const speed = msToKnots(aircraftData.groundSpeed || 0).toFixed(0)

    if(!show) return null

    const style: React.CSSProperties = {
        zIndex: 5,
        position: "relative",
        margin: "10px",
        borderRadius: "10px",
        backgroundColor: "white",
        padding: "10px",
    }

    return (
        <div  className="has-background-light level is-mobile" style={style}>
            <HeaderElement title="Flight Number" value={flightNumber} />
            <HeaderElement title="Latitude" value={lat.coord} unit={lat.hemisphere} />
            <HeaderElement title="Longitude" value={lon.coord} unit={lon.hemisphere} />
            <HeaderElement title="Altitude" value={alt} unit="ft" />
            <HeaderElement title="Heading" value={heading} unit="Degrees" />
            <HeaderElement title="Groundspeed" value={speed} unit="knots" />
        </div>
    )
}

export { MapHeader }