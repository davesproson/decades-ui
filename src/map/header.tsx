import { DataContext } from './context';
import { ddToDmm, metresToFeet, msToKnots } from '../utils';
import { useContext } from 'react';

type HeaderElementProps = {
    title: string,
    value: string,
    unit: string,
}
const HeaderElement = ({ title, value, unit }: HeaderElementProps) => {
    return (
        <div className="level-item has-text-centered">
            <div>
                <p className="heading">{title}</p>
                <p className="title">{value}</p>
                <p className="heading">{unit}</p>
            </div>
        </div>
    )
}

const MapHeader = () => {
    const { aircraftData } = useContext(DataContext)

    const lat = ddToDmm(aircraftData.lat, ['North', 'South'])
    const lon = ddToDmm(aircraftData.lon, ['East', 'West'])
    const alt = metresToFeet(aircraftData.alt || 0).toFixed(0)
    const heading = Math.floor(aircraftData.heading || 0).toString().padStart(3, '0')
    const speed = msToKnots(aircraftData.groundSpeed || 0).toFixed(0)

    return (
        <div className="level is-mobile" style={{ zIndex: 1, position: "relative", top: 0, height: "100px"}}>
            <HeaderElement title="Latitude" value={lat.coord} unit={lat.hemisphere} />
            <HeaderElement title="Longitude" value={lon.coord} unit={lon.hemisphere} />
            <HeaderElement title="Altitude" value={alt} unit="ft" />
            <HeaderElement title="Heading" value={heading} unit="Degrees" />
            <HeaderElement title="Groundspeed" value={speed} unit="knots" />
        </div>
    )
}

export { MapHeader }