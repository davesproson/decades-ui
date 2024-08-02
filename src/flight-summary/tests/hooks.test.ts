import { describe, it, expect, vi } from "vitest"
import { Dispatch, SetStateAction } from "react"

import { useFlightSummary } from "../hooks"
import { testEntry } from "./testdata"
import { FlightSummary } from "../types"
import { renderHook, waitFor } from '@testing-library/react'

vi.mock('../hooks.ts', async () => {
    return {
        ...(await import('../hooks')),
        getData: vi.fn((setter?: Dispatch<SetStateAction<FlightSummary|undefined>>)=> {
            if(setter) setter({[testEntry.uuid]: testEntry})
            return testEntry
        })
    }
})

describe('Check useFlightSummary behaviour', async () => {
    it('Should return the loader data if it exists', async () => {
        const loaderData = { [testEntry.uuid]: testEntry }
        vi.mock('@tanstack/react-router', () => {
            return {
                useLoaderData: () => loaderData
            }
        })
        const { result } = renderHook(() => useFlightSummary())
        waitFor(() => expect(result.current).toBe(loaderData))
    })

    it('Should return the data from the API if the loader data does not exist', async () => {
        vi.mock('@tanstack/react-router', () => {
            return {
                useLoaderData: () => undefined
            }
        })
        const { result } = renderHook(() => useFlightSummary())
        waitFor(() => expect(result.current).toBe({[testEntry.uuid]: testEntry}))
    })
})