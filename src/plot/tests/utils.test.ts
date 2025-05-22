import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import {
    canSlide,
    getAxesArray,
    getTimeLims,
    getXAxis,
    getYAxis,
    paramFromRawName,
    plotIsOngoing,
    slideLength,
} from '../utils'
import { PlotURLOptions } from '../types'

const getOptions = (options: Partial<PlotURLOptions>) => {
    const defaultOptions = {
        params: [''],
        axes: [''],
        swapxy: false,
        style: 'line',
        scrolling: true,
        header: false,
        ordvar: '',
        job: 0,
        timeframe: '30mins',
        mask: false,
    }
    return { ...defaultOptions, ...options }
}

describe('PlotIsOngoing should return true if the plot is ongoing', () => {


    it('Should return true if the timeframe is 30min', () => {
        expect(plotIsOngoing(getOptions({ timeframe: '30mins' }))).toBe(true)
    })
    it('Should return true if the timeframe is 1sec', () => {
        expect(plotIsOngoing(getOptions({ timeframe: '1sec' }))).toBe(true)
    })
    it('Should return true if the timeframe custom but only one value given', () => {
        expect(plotIsOngoing(getOptions({ timeframe: '123456,' }))).toBe(true)
    })
    it('Should return false if start and end times are given', () => {
        expect(plotIsOngoing(getOptions({ timeframe: '123456,123457' }))).toBe(false)
    })
})

describe('paramFromRawName should give the correct param', () => {
    const testParams = [
        { ParameterIdentifier: '101', ParameterName: 'temp', DisplayText: 'Temperature', DisplayUnits: '°C', available: null },
        { ParameterIdentifier: '102', ParameterName: 'wind', DisplayText: 'Wind', DisplayUnits: 'knots', available: null },
        { ParameterIdentifier: '103', ParameterName: 'humidity', DisplayText: 'Humidity', DisplayUnits: '%', available: null },
    ]

    it('Should return the correct parameter when it exists', () => {
        expect(paramFromRawName('wind', testParams)).toBe(testParams[1])
    })

    it('Should return a default parameter with rawName when it does not exist', () => {
        expect(paramFromRawName('notaparam', testParams)).toEqual({
            ParameterIdentifier: 'notaparam',
            ParameterName: 'notaparam',
            DisplayText: 'notaparam',
            DisplayUnits: '?',
            available: null
        })
    })
})


describe('getTimeLims should return the correct time limits for a given time spec string', () => {
    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2020, 1, 2, 3, 4, 5));
    });


    it('Should return the correct time limits for a 30min timeframe', () => {
        const date = Math.floor(new Date().getTime() / 1000)
        expect(getTimeLims('30mins')).toEqual([date - 30 * 60, date])
    })

    it('Should return the correct time limits for a 30sec timeframe', () => {
        const date = Math.floor(new Date().getTime() / 1000)
        expect(getTimeLims('30sec')).toEqual([date - 30, date])
    })

    it('Should return the correct time limits for a 1 hour timeframe', () => {
        const date = Math.floor(new Date().getTime() / 1000)
        expect(getTimeLims('1hour')).toEqual([date - 60 * 60, date])
    })

    it('Should return the correct time limits for a custom timeframe', () => {
        expect(getTimeLims('123456,123457')).toEqual([123456, 123457])
    })

    it('Should return the correct time limits for a custom timeframe with only one value', () => {
        const date = Math.floor(new Date().getTime() / 1000)
        expect(getTimeLims('123456,')).toEqual([123456, date])
    })

    it('Should return the correct time limits for all', () => {
        expect(getTimeLims('all')).toEqual([0, Math.floor(new Date().getTime() / 1000)])
    })

    afterAll(() => {
        vi.useRealTimers();
    })
})

describe('canSlide should return true if the plot can be slid', () => {

    it('Should return true if the timeframe is 30min', () => {
        expect(canSlide(getOptions({ timeframe: '30mins' }))).toBe(true)
    })
    it('Should return true if the timeframe is 1sec', () => {
        expect(canSlide(getOptions({ timeframe: '1sec' }))).toBe(true)
    })
    it('Should return true if the timeframe custom but only one value given', () => {
        expect(canSlide(getOptions({ timeframe: '123456,' }))).toBe(true)
    })
    it('Should return false if start and end times are given', () => {
        expect(canSlide(getOptions({ timeframe: '123456,123457' }))).toBe(false)
    })
})

describe('slideLength should return the correct time limits for a given options set', () => {
    it('Should return the correct time limits for a 30min timeframe', () => {
        expect(slideLength(getOptions({ timeframe: '30mins' }))).toEqual((30 * 60).toString())
    })

    it('Should return the correct time limits for a 30sec timeframe', () => {
        expect(slideLength(getOptions({ timeframe: '30sec' }))).toEqual('30')
    })

    it('Should return the correct time limits for a 1 hour timeframe', () => {
        expect(slideLength(getOptions({ timeframe: '1hour' }))).toEqual((60 * 60).toString())
    })

    // TODO: What if the plot isn't ongoing?
    // TODO: What about custom timeframes?
})

describe('Ensure the correct Y-axis is returned for a given plot configuration', () => {
    it('Should return the correct Y-axis for a single parameter plot', () => {
        const options = getOptions({
            params: ['temp'],
            axes: ['temp']
        })
        expect(getYAxis(options, 'temp')).toEqual('y')
    })

    it('Should return the correct Y-axis for a single parameter plot when limits are given', () => {
        const options = getOptions({
            params: ['temp'],
            axes: ['temp|-10,10']
        })
        expect(getYAxis(options, 'temp')).toEqual('y')
    })

    it('Should return the correct Y-axis for a plot with multiple parameters on different axes', () => {
        const options = getOptions({
            params: ['temp', 'wind'],
            axes: ['temp', 'wind']
        })
        expect(getYAxis(options, 'wind')).toEqual('y2')
        expect(getYAxis(options, 'temp')).toEqual('y')
    })

    it('Should return the correct Y-axis for a plot with multiple parameters on the same axis', () => {
        const options = getOptions({
            params: ['temp', 'wind'],
            axes: ['temp,wind']
        })
        expect(getYAxis(options, 'wind')).toEqual('y')
        expect(getYAxis(options, 'temp')).toEqual('y')
    })

    it('Should return the correct Y-axis for a plot with multiple parameters on the same axis different axes', () => {
        const options = getOptions({
            params: ['temp', 'wind', 'humidity', 'pressure', 'dew_point'],
            axes: ['temp,wind', 'humidity,pressure', 'dew_point']
        })
        expect(getYAxis(options, 'wind')).toEqual('y')
        expect(getYAxis(options, 'temp')).toEqual('y')
        expect(getYAxis(options, 'humidity')).toEqual('y2')
        expect(getYAxis(options, 'pressure')).toEqual('y2')
        expect(getYAxis(options, 'dew_point')).toEqual('y3')
    })
})

describe('Ensure the correct X-axis is returned for a given plot configuration', () => {
    // TODO: this is basically the same as the Y-axis tests, the function should be refactored
    // to take an axis number as an argument
    it('Should return the correct X-axis for a single parameter plot', () => {
        const options = getOptions({
            params: ['temp'],
            axes: ['temp']
        })
        expect(getXAxis(options, 'temp')).toEqual('x')
    })

    it('Should return the correct X-axis for a single parameter plot when limits are given', () => {
        const options = getOptions({
            params: ['temp'],
            axes: ['temp|-10,10']
        })
        expect(getXAxis(options, 'temp')).toEqual('x')
    })

    it('Should return the correct X-axis for a plot with multiple parameters on different axes', () => {
        const options = getOptions({
            params: ['temp', 'wind'],
            axes: ['temp', 'wind']
        })
        expect(getXAxis(options, 'wind')).toEqual('x2')
        expect(getXAxis(options, 'temp')).toEqual('x')
    })

    it('Should return the correct X-axis for a plot with multiple parameters on the same axis', () => {
        const options = getOptions({
            params: ['temp', 'wind'],
            axes: ['temp,wind']
        })
        expect(getXAxis(options, 'wind')).toEqual('x')
        expect(getXAxis(options, 'temp')).toEqual('x')
    })

    it('Should return the correct X-axis for a plot with multiple parameters on the same axis different axes', () => {
        const options = getOptions({
            params: ['temp', 'wind', 'humidity', 'pressure', 'dew_point'],
            axes: ['temp,wind', 'humidity,pressure', 'dew_point']
        })
        expect(getXAxis(options, 'wind')).toEqual('x')
        expect(getXAxis(options, 'temp')).toEqual('x')
        expect(getXAxis(options, 'humidity')).toEqual('x2')
        expect(getXAxis(options, 'pressure')).toEqual('x2')
        expect(getXAxis(options, 'dew_point')).toEqual('x3')
    })
})


const getVars = ({ selectedParams, axes }: { selectedParams: string[], axes?: any[] }) => {
    return {
        params: [
            { id: 100, name: 'Temperature', raw: 'temp', units: '°C', selected: selectedParams.includes('temp'), axisId: 1, status: null },
            { id: 101, name: 'Dew Point', raw: 'dew', units: '°C', selected: selectedParams.includes('dew'), axisId: 1, status: null },
            { id: 101, name: 'PotTemp', raw: 'theta', units: '°C', selected: selectedParams.includes('theta'), axisId: 2, status: null },
        ],
        axes: axes || [],
        paramSet: 'default',
        paramsDispatched: true
    }
}
const getAxis = (id: number, units: string) => {
    return {
        id,
        units,
        scaling: {
            auto: true,
            min: '-10',
            max: '10'
        }
    }
}
describe('Ensure the axis array is built correctly for a given plot configuration', () => {
    it('Should return a single axis for a single parameter plot', () => {
        expect(getAxesArray(getVars({
            selectedParams: ['temp'],
            axes: [getAxis(1, '°C')]
        }))).toEqual(['temp'])
    })

    it('Should return a single axis for a parameters with same axisId', () => {
        expect(getAxesArray(getVars({
            selectedParams: ['temp', 'dew'],
            axes: [getAxis(1, '°C')]
        }))).toEqual(['temp,dew'])
    })

    it('Should return a different axis for params with same unit but different axis id', () => {
        expect(getAxesArray(getVars({
            selectedParams: ['temp', 'theta'],
            axes: [getAxis(1, '°C'), getAxis(2, '°C')]
        }))).toEqual(['temp', 'theta'])
    })

    it('Should return a different axis for params with same unit but different axis id and same axis for those with same id', () => {
        expect(getAxesArray(getVars({
            selectedParams: ['temp', 'theta', 'dew'],
            axes: [getAxis(1, '°C'), getAxis(2, '°C')]
        }))).toEqual(['temp,dew', 'theta'])
    })
})

// TODO: there's a bunch of tests that require mocking to be written


