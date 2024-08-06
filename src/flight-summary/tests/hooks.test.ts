import { describe, it, expect, vi } from "vitest"
import { Dispatch, SetStateAction } from "react"

import { useFlightSummary } from "../hooks"
import { testEntry } from "./testdata"
import { FlightSummary } from "../types"
import { renderHook, waitFor } from '@testing-library/react'

const mocks = vi.hoisted(() => {
    return {
        useLoaderData: vi.fn()
    }
});

vi.mock('../hooks', async () => {
    return {
        ...(await import('../hooks')),
        getData: vi.fn((setter?: Dispatch<SetStateAction<FlightSummary | undefined>>) => {
            if (setter) setter({ [testEntry.uuid]: testEntry })
            return testEntry
        })
    }
})

vi.mock('@tanstack/react-router', async () => {

    return {
        ...(await import('@tanstack/react-router')),
        useLoaderData: mocks.useLoaderData
    }
})


describe('Check useFlightSummary behaviour', async () => {
    it('Should return the loader data if it exists', async () => {
        mocks.useLoaderData.mockImplementationOnce(() => {
            return { [testEntry.uuid]: testEntry }
        })

        const { result } = renderHook(useFlightSummary)
        await waitFor(() => expect(result.current).toBe({ [testEntry.uuid]: testEntry }))
    })

    it('Should return the data from the API if the loader data does not exist', async () => {
        vi.mock('@tanstack/react-router', async () => {
            return {
                useLoaderData: () => undefined
            }
        })
        const { result } = renderHook(() => useFlightSummary())
        await waitFor(() => expect(result.current).toBe({ [testEntry.uuid]: testEntry }))
    })
})