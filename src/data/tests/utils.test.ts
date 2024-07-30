import { afterAll, beforeAll, describe, expect, it, Mock, vi } from "vitest"
import { getData, getDataUrl } from "../utils"
import { apiEndpoints } from "@/settings"

const mocks = vi.hoisted(() => {
    return {
        getState: vi.fn(),
    }
})

vi.mock('@store', () => {
    return {
        default: {
            getState: mocks.getState
        }
    }
})

global.fetch = vi.fn((args) => {
    const searchParams = new URL(args).searchParams

    const a: { [key: string]: number[] } = {}
    const start_time = parseInt(searchParams.get('frm') || '0')
    const end_time = parseInt(searchParams.get('to') || Math.floor(Date.now() / 1000).toString())
    const params = searchParams.getAll('para')
    a['utc_time'] = new Array<number>(end_time - start_time).fill(0).map((_, i) => start_time + i)
    for (const param of params) {
        a[param] = new Array<number>(end_time - start_time).fill(0)
    }


    return Promise.resolve({
        ok: true,
        status: 200,
        params: searchParams.getAll('para'),
        json: () => Promise.resolve(a)
    })
}) as Mock

describe('Check getData behaviour', async () => {
    beforeAll(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(2020, 1, 1))
        mocks.getState.mockReturnValue({
            quicklook: { qcJob: 123 },
            config: { quickLookMode: false }
        })
    })

    it('Should return last 5s given a single parameter and no time lims', async () => {
        const data = await getData({ params: ['param1'] })
        expect(Object.keys(data)).toContain('param1')
        expect(Object.keys(data)).toContain('utc_time')
        expect(data['param1'].length).toBe(5)
        expect(data['utc_time'].length).toBe(5)
        expect(data['utc_time'][0]).toBe(1580515200 - 5)
        expect(data['utc_time'][4]).toBe(1580515199)
    })

    it('Should return last 5s given a two parameters and no time lims', async () => {
        const data = await getData({ params: ['param1', 'param2'] })
        expect(Object.keys(data)).toContain('param1')
        expect(Object.keys(data)).toContain('param2')
        expect(Object.keys(data)).toContain('utc_time')
        expect(data['param1'].length).toBe(5)
        expect(data['param2'].length).toBe(5)
        expect(data['utc_time'].length).toBe(5)
        expect(data['utc_time'][0]).toBe(1580515200 - 5)
        expect(data['utc_time'][4]).toBe(1580515199)
    })

    it('Should return last 30s of data when given a start time', async () => {
        const data = await getData({ params: ['param1'] }, 1580515200 - 30)
        expect(Object.keys(data)).toContain('param1')
        expect(Object.keys(data)).toContain('utc_time')
        expect(data['param1'].length).toBe(30)
        expect(data['utc_time'].length).toBe(30)
        expect(data['utc_time'][0]).toBe(1580515200 - 30)
        expect(data['utc_time'][29]).toBe(1580515199)
    })

    it('Should return the requested time range', async () => {
        const data = await getData({ params: ['param1'] }, 1580515200 - 30, 1580515200 - 20)
        expect(Object.keys(data)).toContain('param1')
        expect(Object.keys(data)).toContain('utc_time')
        expect(data['param1'].length).toBe(10)
        expect(data['utc_time'].length).toBe(10)
        expect(data['utc_time'][0]).toBe(1580515200 - 30)
        expect(data['utc_time'][9]).toBe(1580515200 - 21)
    })

    afterAll(() => {
        vi.useRealTimers()
    })
})

describe('Check the correct data URL is returned by getDataUrl', () => {

    it('Should return correct url for live data with no end time', () => {
        mocks.getState.mockReturnValue({
            quicklook: { qcJob: 123 },
            config: { quickLookMode: false }
        })
        const url = new URL(getDataUrl({ params: ['param1', 'param2'] }, 2000))
        expect(url.searchParams.get('frm')).toBe('2000')
        expect(url.searchParams.get('to')).toBe(null)
        expect(url.searchParams.getAll('para')).toContain('param1')
        expect(url.searchParams.getAll('para')).toContain('param2')
        expect(url.searchParams.get('job')).toBe(null)
        expect(url.pathname).toBe(apiEndpoints.data)
    })

    it('Should return correct url for live data with no end time', () => {
        mocks.getState.mockReturnValue({
            quicklook: { qcJob: 123 },
            config: { quickLookMode: false }
        })
        const url = new URL(getDataUrl({ params: ['param1', 'param2'] }, 2000))
        expect(url.searchParams.get('frm')).toBe('2000')
        expect(url.searchParams.get('to')).toBe(null)
        expect(url.searchParams.getAll('para')).toContain('param1')
        expect(url.searchParams.getAll('para')).toContain('param2')
        expect(url.searchParams.get('job')).toBe(null)
        expect(url.pathname).toBe(apiEndpoints.data)

    })

    it('Should return correct url for live data with specified end time', () => {
        mocks.getState.mockReturnValue({
            quicklook: { qcJob: 123 },
            config: { quickLookMode: false }
        })
        const url = new URL(getDataUrl({ params: ['param1'] }, 2000, 5000))
        expect(url.searchParams.get('frm')).toBe('2000')
        expect(url.searchParams.get('to')).toBe('5000')
        expect(url.searchParams.getAll('para')).toContain('param1')
        expect(url.searchParams.get('job')).toBe(null)
        expect(url.pathname).toBe(apiEndpoints.data)
    })

    it('Should return correct url for live data with non standard ordinate variable', () => {
        mocks.getState.mockReturnValue({
            quicklook: { qcJob: 123 },
            config: { quickLookMode: false }
        })
        const url = new URL(getDataUrl({ params: ['param1'], ordvar: 'ordparam'}, 2000, 5000))
        expect(url.searchParams.get('frm')).toBe('2000')
        expect(url.searchParams.get('to')).toBe('5000')
        expect(url.searchParams.getAll('para')).toContain('param1')
        expect(url.searchParams.getAll('para')).toContain('ordparam')
        expect(url.searchParams.get('job')).toBe(null)
        expect(url.pathname).toBe(apiEndpoints.data)
    })

    it('Should use the quicklook endpoint if quicklook mode is enabled', () => {
        mocks.getState.mockReturnValue({
            quicklook: { qcJob: 123 },
            config: { quickLookMode: true }
        })
        const url = new URL(getDataUrl({ params: ['param1'] }, 2000, 5000))
        expect(url.searchParams.get('frm')).toBe('2000')
        expect(url.searchParams.get('to')).toBe('5000')
        expect(url.searchParams.getAll('para')).toContain('param1')
        expect(url.searchParams.get('job')).toBe('123')
        expect(url.origin + url.pathname).toBe(`${apiEndpoints.quicklook_data}`)
    })
})

