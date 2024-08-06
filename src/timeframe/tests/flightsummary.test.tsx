import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { FlightSummarySelector } from "../flightsummary";
import { setupTestStore } from "@/tests";
import {
    RunFlightSummary,
    // ProfileFlightSummary,
    // OrbitFlightSummary,
    // CombinedFlightSummary  
} from "./testdata";

const mocks = vi.hoisted(() => {
    return {
        getFlightSummary: vi.fn(),
        useLoaderData: vi.fn(),
        useFlightSummary: vi.fn(),
    };
})

vi.mock("@/flight-summary/hooks", async () => {
    return {
        ...(await import('@/flight-summary/hooks')),
        getFlightSummary: mocks.getFlightSummary,
        useFlightSummary: mocks.useFlightSummary,
    };
})

// vi.mock("@tanstack/react-router", () => {
//     return {
//         useLoaderData: mocks.useLoaderData,
//     };
// })

describe("Test FlightSummarySelector component", () => {

    const storeRef = setupTestStore()

    it("Should render", () => {
        render(<FlightSummarySelector />, { wrapper: storeRef.Wrapper })
        expect(screen.getByText("Flight Summary")).toBeDefined()
    })

    it("Should render a run correctly", async () => {
        mocks.getFlightSummary.mockImplementation(()=>{
            console.log('getFlightSummary mock called')
            return {0: RunFlightSummary}
        })
        render(<FlightSummarySelector />, { wrapper: storeRef.Wrapper })

        await waitFor(() => {
            // expect(screen.getByText(RunFlightSummary.event)).toBeDefined()
            // expect(screen.getByText(new Date(RunFlightSummary.start.time).toLocaleTimeString())).toBeDefined()
            // expect(screen.getByText(new Date(RunFlightSummary.stop.time).toLocaleTimeString())).toBeDefined()
            // expect(screen.getByText(RunFlightSummary.event).closest('svg')).toHaveClass('lucide-move-right')
        })
    })

    // it("Should render a profile correctly", async () => {
    //     mocks.useFlightSummary.mockReturnValue({0: ProfileFlightSummary})
    //     render(<FlightSummarySelector />, { wrapper: storeRef.Wrapper })

    //     await waitFor(() => {
    //         expect(screen.getByText(ProfileFlightSummary.event)).toBeDefined()
    //         expect(screen.getByText(new Date(ProfileFlightSummary.start.time).toLocaleTimeString())).not.toBeDefined()
    //         expect(screen.getByText(new Date(ProfileFlightSummary.stop.time).toLocaleTimeString())).not.toBeDefined()
    //         expect(screen.getByText(ProfileFlightSummary.event).closest('svg')).toHaveClass('lucide-move-up-right')
    //     })
    // })

    // it("Should render an orbit correctly", () => {
    //     mocks.useFlightSummary.mockReturnValue({0: OrbitFlightSummary})
    //     render(<FlightSummarySelector />, { wrapper: storeRef.Wrapper })

    //     waitFor(() => {
    //         expect(screen.getByText(OrbitFlightSummary.event)).toBeDefined()
    //         expect(screen.getByText(new Date(OrbitFlightSummary.start.time).toLocaleTimeString())).toBeDefined()
    //         expect(screen.getByText(new Date(OrbitFlightSummary.stop.time).toLocaleTimeString())).toBeDefined()
    //         expect(screen.getByText(OrbitFlightSummary.event).closest('svg')).toHaveClass('lucide-rotate')
    //     })
    // })
})