import { DataContext } from './context';
// import { OverlayBox } from './overlayBox';
import { ddToDmm, metresToFeet, msToKnots, getFlightNumber } from '../utils';
import { useContext, useEffect, useState } from 'react';
import { badData } from '@/settings';

type HeaderElementProps = {
    title?: string,
    value: string,
    unit?: string,
    hide?: "mobile" | "touch"
}


const HeaderElement = ({ title, value, unit, hide }: HeaderElementProps) => {
    const TitleElement = () => title ? <p className="whitespace-nowrap overflow-hidden text-sm font-mono m-auto text-muted-foreground">{title.toUpperCase()}</p> : null
    const UnitElement = () => unit ? <p className="whitespace-nowrap overflow-hidden text-sm font-mono text-muted-foreground m-auto mot-[-5px]">{unit.toUpperCase()}</p> : null
    const ValueElement = () => <p className="whitespace-nowrap overflow-hidden text-[2em] m-auto font-sans mot-[-8px]">{value}</p>
    const NoDataElement = () => <p className="whitespace-nowrap overflow-hidden text-[1em] m-auto font-sans mot-[-8px]">No Data</p>

    let hiddenClass = (hide === "mobile")
        ? "hidden md:block"
        : hide === "touch"
            ? "hidden lg:block"
            : ""

    return (
        <div className={hiddenClass}>
            <div className='flex flex-col'>
                <TitleElement />
                {/* This is a scuzzy way of doing this -> TODO! */}
                {value === "No Data" && <NoDataElement /> || <ValueElement />}
                <UnitElement />
            </div>
        </div>
    )
}

const MapHeader = () => {
    const { aircraftData } = useContext(DataContext)
    const [flightNumber, setFlightNumber] = useState<string>('----')

    const filterBad = (x: number, unit: string, conversion: (x: number) => string) => {
        if (x === badData) return {
            value: 'No Data',
            unit: ''
        }
        return {
            value: conversion(x),
            unit: unit
        }
    }

    useEffect(() => {
        const updateFlightNumber = () => getFlightNumber().then(x => setFlightNumber(x))
        updateFlightNumber()
        const interval = setInterval(() => {
            updateFlightNumber()
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    if (!aircraftData) return null

    const lat = ddToDmm(aircraftData.lat, ['North', 'South'])
    const lon = ddToDmm(aircraftData.lon, ['East', 'West'])
    const alt = filterBad(aircraftData.alt || 0, 'ft', x => metresToFeet(x).toFixed(0))
    const heading = filterBad(aircraftData.heading || 0, 'Degrees', x => Math.floor(x).toString().padStart(3, '0'))
    const speed = filterBad(aircraftData.groundSpeed || 0, 'knots', x => msToKnots(x).toFixed(0))

    return (
        <div className="relative bg-background p-3 z-10 rounded-md h-[110px] m-4">
            <div className="flex justify-around items-center">
                <HeaderElement hide="mobile" title="Flight Number" value={flightNumber} />
                <HeaderElement title="Latitude" value={lat.coord} unit={lat.hemisphere} />
                <HeaderElement title="Longitude" value={lon.coord} unit={lon.hemisphere} />
                <HeaderElement hide="touch" title="Altitude" {...alt} />
                <HeaderElement hide="touch" title="Heading" {...heading} />
                <HeaderElement hide="touch" title="Groundspeed" {...speed} />
            </div>
        </div>
    )
}

export { MapHeader }