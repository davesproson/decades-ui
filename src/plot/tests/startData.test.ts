import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from '@testing-library/react'
import { startData } from '../utils'

const mocks = vi.hoisted(() => ({
    authFetch: vi.fn(),
    getDataUrl: vi.fn(() => 'http://test/data'),
}))

vi.mock('@/utils', () => ({
    authFetch: mocks.authFetch,
}))

vi.mock('@/data/utils', () => ({
    getDataUrl: mocks.getDataUrl,
}))

const mockResponse = (data: object) =>
    Promise.resolve({ json: () => Promise.resolve(data) })

const baseOptions = {
    params: ['param1'],
    axes: ['param1'],
    swapxy: false,
    style: 'line',
    scrolling: true,
    header: false,
    ordvar: 'utc_time',
    timeframe: '30min',
    mask: false,
    caxis: '',
}

const makeArgs = (overrides = {}) => ({
    options: baseOptions,
    start: 1000000,
    ref: null,
    signal: { abort: false },
    callback: vi.fn(),
    ...overrides,
})

const setVisibilityState = (state: 'visible' | 'hidden') => {
    Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: state,
    })
}

describe('startData onTimestamp', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        setVisibilityState('visible')
        mocks.authFetch.mockClear()
        mocks.getDataUrl.mockClear()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('calls onTimestamp with the last utc_time when params have good data', async () => {
        mocks.authFetch.mockReturnValue(mockResponse({
            utc_time: [1000001, 1000002],
            param1: [10, 20],
        }))
        const onTimestamp = vi.fn()
        startData(makeArgs({ onTimestamp }))
        await act(async () => {})
        expect(onTimestamp).toHaveBeenCalledWith(1000002)
    })

    it('does not call onTimestamp when all params have bad data', async () => {
        mocks.authFetch.mockReturnValue(mockResponse({
            utc_time: [1000001, 1000002],
            param1: [-999.99, -999.99],
        }))
        const onTimestamp = vi.fn()
        startData(makeArgs({ onTimestamp }))
        await act(async () => {})
        expect(onTimestamp).not.toHaveBeenCalled()
    })

    it('does not call onTimestamp when utc_time is empty', async () => {
        mocks.authFetch.mockReturnValue(mockResponse({
            utc_time: [],
            param1: [],
        }))
        const onTimestamp = vi.fn()
        startData(makeArgs({ onTimestamp }))
        await act(async () => {})
        expect(onTimestamp).not.toHaveBeenCalled()
    })

    it('does not call onTimestamp when fetch fails', async () => {
        mocks.authFetch.mockRejectedValue(new Error('network error'))
        const onTimestamp = vi.fn()
        startData(makeArgs({ onTimestamp }))
        await act(async () => {})
        expect(onTimestamp).not.toHaveBeenCalled()
    })

    it('calls onTimestamp when at least one param has good data among multiple params', async () => {
        mocks.authFetch.mockReturnValue(mockResponse({
            utc_time: [1000001],
            param1: [-999.99],
            param2: [42],
        }))
        const onTimestamp = vi.fn()
        startData({ ...makeArgs({ onTimestamp }), options: { ...baseOptions, params: ['param1', 'param2'] } })
        await act(async () => {})
        expect(onTimestamp).toHaveBeenCalledWith(1000001)
    })

    it('propagates onTimestamp to recursive fetches', async () => {
        mocks.authFetch.mockReturnValue(mockResponse({
            utc_time: [1000001],
            param1: [10],
        }))
        const onTimestamp = vi.fn()
        startData(makeArgs({ onTimestamp }))

        await act(async () => {})
        expect(onTimestamp).toHaveBeenCalledTimes(1)

        await act(async () => { vi.advanceTimersByTime(1000) })
        await act(async () => {})
        expect(onTimestamp).toHaveBeenCalledTimes(2)
    })
})
