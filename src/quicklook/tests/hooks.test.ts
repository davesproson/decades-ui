import { renderHookWithStore } from '@/tests'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setQuickLookMode } from '@/redux/configSlice'
import { setQcJob } from '@/redux/quicklookSlice'
import { act, waitFor } from '@testing-library/react'
import { testFunctions, useQuickLookTimeframe, useQuicklookJobs } from '../hooks'
import { apiJobs, dataTimes } from './testdata'

const { start_time_api, end_time_api, baseTime } = dataTimes

const mocks = vi.hoisted(() => ({
    fetch: vi.fn()
}))

vi.mock('@/utils', async () => ({
    ...(await import('@/utils')),
    authFetch: mocks.fetch
}))



describe('Test useQuickLookTimeframe', async () => {

    beforeEach(() => {
        mocks.fetch.mockClear()
    })

    it("Should set the timeframe correctly", async () => {
        mocks.fetch.mockResolvedValue({
            json: () => Promise.resolve({
                utc_time: new Array(end_time_api - start_time_api + 1).fill(start_time_api).map((v, i) => v + i)
            })
        })

        const { store, } = renderHookWithStore(useQuickLookTimeframe)
        act(() => store.dispatch(setQuickLookMode(true)))
        act(() => store.dispatch(setQcJob(1)))
        await waitFor(() => {
            expect(mocks.fetch).toBeCalled()
            expect(store.getState().options.customTimeframe.start).toBe(start_time_api * 1000)
            expect(store.getState().options.customTimeframe.end).toBe(end_time_api * 1000)
            expect(store.getState().quicklook.dataTimeSpan?.start).toBe(start_time_api * 1000)
            expect(store.getState().quicklook.dataTimeSpan?.end).toBe(end_time_api * 1000)
            expect(store.getState().quicklook.baseTime).toBe(baseTime)
        })
    })
})



describe('Test useQuickLookJobs', async () => {
    beforeEach(() => {
        mocks.fetch.mockClear()
    })

    it("Should fetch and set jobs", async () => {
        mocks.fetch.mockResolvedValue({
            json: () => Promise.resolve(apiJobs)
        })
        const { apiJobToInteralJob } = testFunctions

        const { store, } = renderHookWithStore(useQuicklookJobs)
        await waitFor(() => {
            expect(mocks.fetch).toBeCalled()
            expect(store.getState().quicklook.qcJobs).toEqual(apiJobs.results.map(apiJobToInteralJob))
        })
    })
})
