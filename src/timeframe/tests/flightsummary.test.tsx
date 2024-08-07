import { FlightSummarySelector } from "../flightsummary";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, screen, waitFor } from "@testing-library/react";
import {
    RunFlightSummary,
    ProfileFlightSummary,
    OrbitFlightSummary,
} from "./testdata";
import { renderWithStore } from "@/tests";

const mocks = vi.hoisted(() => ({
    fetch: vi.fn(),
    useLoaderData: vi.fn(),
}))

vi.mock("@/flight-summary/hooks", async () => {
    return {
        ...(await import('@/flight-summary/hooks')),
        fetch: mocks.fetch,
    };
})

vi.mock("@tanstack/react-router", () => {
    return {
        useLoaderData: mocks.useLoaderData,
    };
})

vi.mock("@/utils", async () => {
    return {
        ...(await import('@/utils')),
        authFetch: mocks.fetch,
    };
})


describe("Test FlightSummarySelector component", () => {

    beforeEach(() => {
        mocks.fetch.mockClear()
        cleanup()   
    })


    it("Should render", () => {
        renderWithStore(<FlightSummarySelector />)
        expect(screen.getByText("Flight Summary")).toBeDefined()
    })

    it("Should render a run correctly", async () => {
        mocks.fetch.mockImplementation(() => {
            return Promise.resolve({json: () => {return {0: RunFlightSummary}}})
        })
        renderWithStore(<FlightSummarySelector />)

        await waitFor(() => {
            const from = new Date(RunFlightSummary.start.time * 1000).toLocaleTimeString()
            const to = new Date(RunFlightSummary.stop.time * 1000).toLocaleTimeString()
            const timeString = `from ${from} until ${to}` 
            expect(screen.getByText(timeString)).toBeDefined()
            expect(screen.getByText(RunFlightSummary.event)).toBeDefined()
            expect(screen.getByTestId('fs-run-icon')).toBeDefined()
        })
    })

    it("Should render a profile correctly", async () => {
        mocks.fetch.mockImplementation(() => {
            return Promise.resolve({json: () => {return {0: ProfileFlightSummary}}})
        })
        renderWithStore(<FlightSummarySelector />)

        await waitFor(() => {
            const from = new Date(RunFlightSummary.start.time * 1000).toLocaleTimeString()
            const to = new Date(RunFlightSummary.stop.time * 1000).toLocaleTimeString()
            const timeString = `from ${from} until ${to}` 
            expect(screen.getByText(timeString)).toBeDefined()
            expect(screen.getByText(ProfileFlightSummary.event)).toBeDefined()
            expect(screen.getByTestId('fs-profile-icon')).toBeDefined()
        })
    })

    it("Should render an orbit correctly", async () => {
        mocks.fetch.mockImplementation(() => {
            return Promise.resolve({json: () => {return {0: OrbitFlightSummary}}})
        })
        renderWithStore(<FlightSummarySelector />)

        await waitFor(() => {
            const from = new Date(RunFlightSummary.start.time * 1000).toLocaleTimeString()
            const to = new Date(RunFlightSummary.stop.time * 1000).toLocaleTimeString()
            const timeString = `from ${from} until ${to}` 
            expect(screen.getByText(timeString)).toBeDefined()
            expect(screen.getByText(OrbitFlightSummary.event)).toBeDefined()
            expect(screen.getByTestId('fs-orbit-icon')).toBeDefined()
        })
    })

})