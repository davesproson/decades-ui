import { badData } from '@/settings';
import type {
    BackgroundTrace
} from '../types'

import { getIsotherms } from './isotherms';
import { K, KELV, MA, dIsoTherm, dPress, isoThermMax, isoThermMin, pressMax, pressMin } from './constants';

import { getThetas } from './thetas';
import { dTheta, thetaMax, thetaMin } from './constants';
import { getIsobars } from './isobars';
import { getMassMixingRatios } from './massMixingRatio';
import { getSatAdiabats } from './saturatedAdiabats';

/*===================================================================
 * Returns the set of plotly traces that makes up the 'background'
 * of the tephigram.
 *
 * Returns:
 *  traces - an array of traces containing lines of constant temp,
 *           theta, pressure, mass mixing ratio and sat. adiabats.
 *===================================================================*/
export const getTraces = (darkMode: boolean) => {
    const traces: Array<BackgroundTrace> = (
        getIsotherms(isoThermMin, isoThermMax, dIsoTherm, darkMode)
    )
    let _traces: Array<BackgroundTrace> = (
        getThetas(thetaMin, thetaMax, dTheta, darkMode)
    )
    traces.push.apply(traces, _traces);

    _traces = getIsobars(pressMin, pressMax, dPress, darkMode);
    traces.push.apply(traces, _traces);

    _traces = getMassMixingRatios(darkMode);
    traces.push.apply(traces, _traces);

    _traces = getSatAdiabats(darkMode);
    traces.push.apply(traces, _traces);


    return traces
}

/*===================================================================
 * Map from pressure, temperature to graphing x, y cooddinates.
 *
 * Args:
 *      press: pressure in hPa
 *      temp: temperature in degrees C
 *
 * Returns:
 *      a length-2 array containing x and y coordinates.
 *===================================================================*/
export const tphiToXy = (press: number, temp: number): [number | null, number | null] => {
    if (press === badData || temp === badData) {
        return [null, null];
    }
    const t = temp + KELV;
    const theta = t * (Math.pow((1000 / press), K));
    const phi = Math.log(theta);
    const x = phi * MA + temp;
    const y = phi * MA - temp;

    return [x, y];
}