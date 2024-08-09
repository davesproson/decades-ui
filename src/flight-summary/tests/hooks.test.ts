import { describe, it, expect, vi, beforeEach } from "vitest"

import { useFlightSummary } from "../hooks"
import { testEntry } from "./testdata"
import { cleanup, renderHook, waitFor } from '@testing-library/react'

const mocks = vi.hoisted(() => ({
    useLoaderData: vi.fn(),
    fetch: vi.fn(),
}));

vi.mock('@tanstack/react-router',  async () => {
    return {
        useLoaderData: mocks.useLoaderData
    }
})

vi.mock('@/utils', async () => {
    return {
        authFetch: mocks.fetch
    }
})


describe('Check useFlightSummary behaviour', async () => {

    beforeEach(() => {
        mocks.useLoaderData.mockClear()
        cleanup()
    })

    it('Should return the loader data if it exists', async () => {
        mocks.useLoaderData.mockImplementation(() => ({ [testEntry.uuid]: testEntry }))
        const { result } = renderHook(useFlightSummary)
        await waitFor(() => expect(result.current).toStrictEqual({ [testEntry.uuid]: testEntry }))
    })

    it('Should return the data from the API if the loader data does not exist', async () => {
        mocks.fetch.mockResolvedValueOnce({ json: () =>({ [testEntry.uuid]: testEntry })})
        const { result } = renderHook(() => useFlightSummary())
        await waitFor(() => expect(result.current).toStrictEqual({ [testEntry.uuid]: testEntry }))
    })
})
