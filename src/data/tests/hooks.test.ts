import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { usePollingData } from '../hooks'

const mocks = vi.hoisted(() => ({
    getData: vi.fn(),
}))

vi.mock('../utils', () => ({
    getData: mocks.getData,
}))

const setVisibilityState = (state: 'visible' | 'hidden') => {
    Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: state,
    })
}

describe('usePollingData', () => {
    beforeEach(() => {
        setVisibilityState('visible')
        mocks.getData.mockClear()
    })

    afterEach(() => {
        cleanup()
        vi.useRealTimers()
    })

    it('returns { data: undefined, error: null } before the first fetch resolves', () => {
        mocks.getData.mockReturnValue(new Promise(() => {}))
        const { result } = renderHook(() => usePollingData({ params: ['param1'] }))
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeNull()
    })

    it('returns fetched data after a successful fetch', async () => {
        const mockData = { utc_time: [1, 2, 3], param1: [10, 20, 30] }
        mocks.getData.mockResolvedValue(mockData)
        const { result } = renderHook(() => usePollingData({ params: ['param1'] }))
        await waitFor(() => expect(result.current.data).toEqual(mockData))
        expect(result.current.error).toBeNull()
    })

    it('issues a second fetch after intervalMs following a successful response', async () => {
        vi.useFakeTimers()
        const mockData = { utc_time: [1], param1: [10] }
        mocks.getData.mockResolvedValue(mockData)
        renderHook(() => usePollingData({ params: ['param1'] }, 1000))

        // Flush initial fetch + response (schedules next setTimeout)
        await act(async () => {})
        expect(mocks.getData).toHaveBeenCalledTimes(1)

        // Advance past intervalMs; second tick fires, getData called again
        await act(async () => { vi.advanceTimersByTime(1000) })
        expect(mocks.getData).toHaveBeenCalledTimes(2)
    })

    it('does not issue a second fetch until the first has resolved (backpressure)', async () => {
        vi.useFakeTimers()
        let resolveFirst!: (value: unknown) => void
        const firstFetch = new Promise(r => { resolveFirst = r })
        mocks.getData.mockReturnValueOnce(firstFetch)
        mocks.getData.mockResolvedValue({ utc_time: [], param1: [] })

        renderHook(() => usePollingData({ params: ['param1'] }, 1000))
        expect(mocks.getData).toHaveBeenCalledTimes(1)

        // Advance past intervalMs while first fetch is still in-flight
        await act(async () => { vi.advanceTimersByTime(1000) })
        // No setTimeout was scheduled (backpressure), so no second fetch
        expect(mocks.getData).toHaveBeenCalledTimes(1)

        // Resolve the first fetch; schedule() is called, setTimeout(tick, 1000) registered
        await act(async () => { resolveFirst({ utc_time: [], param1: [] }) })

        // Advance to fire the scheduled tick
        await act(async () => { vi.advanceTimersByTime(1000) })
        expect(mocks.getData).toHaveBeenCalledTimes(2)
    })

    it('sets error and retains last good data after a failed fetch', async () => {
        vi.useFakeTimers()
        const mockData = { utc_time: [1], param1: [10] }
        const mockError = new Error('fetch failed')
        mocks.getData.mockResolvedValueOnce(mockData)
        mocks.getData.mockRejectedValue(mockError)

        const { result } = renderHook(() => usePollingData({ params: ['param1'] }, 1000))

        // Flush initial successful fetch
        await act(async () => {})
        expect(result.current.data).toEqual(mockData)
        expect(result.current.error).toBeNull()

        // Advance to fire second tick (which fails)
        await act(async () => { vi.advanceTimersByTime(1000) })
        await act(async () => {})

        expect(result.current.error).toEqual(mockError)
        expect(result.current.data).toEqual(mockData)
    })

    it('retries after intervalMs following a failed fetch', async () => {
        vi.useFakeTimers()
        const mockError = new Error('fetch failed')
        const mockData = { utc_time: [1], param1: [10] }
        mocks.getData.mockRejectedValueOnce(mockError)
        mocks.getData.mockResolvedValue(mockData)

        const { result } = renderHook(() => usePollingData({ params: ['param1'] }, 1000))

        // Flush initial failed fetch
        await act(async () => {})
        expect(result.current.error).toEqual(mockError)
        expect(mocks.getData).toHaveBeenCalledTimes(1)

        // Advance to fire retry
        await act(async () => { vi.advanceTimersByTime(1000) })
        await act(async () => {})

        expect(result.current.data).toEqual(mockData)
        expect(mocks.getData).toHaveBeenCalledTimes(2)
    })

    it('skips fetch when tab is hidden and fires when tab becomes visible', async () => {
        vi.useFakeTimers()
        const mockData = { utc_time: [1], param1: [10] }
        mocks.getData.mockResolvedValue(mockData)

        renderHook(() => usePollingData({ params: ['param1'] }, 1000))

        // Flush first fetch + schedule next tick
        await act(async () => {})
        expect(mocks.getData).toHaveBeenCalledTimes(1)

        // Hide the tab
        setVisibilityState('hidden')

        // Advance past intervalMs — tick fires but skips fetch, reschedules
        await act(async () => { vi.advanceTimersByTime(1000) })
        expect(mocks.getData).toHaveBeenCalledTimes(1)

        // Show tab — visibilitychange handler cancels pending reschedule and fires tick immediately
        await act(async () => {
            setVisibilityState('visible')
            document.dispatchEvent(new Event('visibilitychange'))
        })
        await act(async () => {})

        expect(mocks.getData).toHaveBeenCalledTimes(2)
    })

    it('does not schedule further fetches after unmount', async () => {
        vi.useFakeTimers()
        let resolveFirst!: (value: unknown) => void
        const firstFetch = new Promise(r => { resolveFirst = r })
        mocks.getData.mockReturnValue(firstFetch)

        const { unmount } = renderHook(() => usePollingData({ params: ['param1'] }, 1000))
        expect(mocks.getData).toHaveBeenCalledTimes(1)

        unmount()

        // Resolve after unmount — mounted flag is false, schedule() not called
        await act(async () => { resolveFirst({ utc_time: [1], param1: [10] }) })

        // Advance timers — no new fetch should be scheduled
        await act(async () => { vi.advanceTimersByTime(2000) })
        expect(mocks.getData).toHaveBeenCalledTimes(1)
    })
})
