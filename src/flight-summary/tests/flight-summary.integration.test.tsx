import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest"
import { act } from "react";
import { testEntry } from "./testdata";
import FlightSummary from "../flight-summary";

const mocks = vi.hoisted(() => {
    return {
        getFlightSummary: vi.fn(),
        useFlightSummary: vi.fn(),
        
    }
})

vi.mock('../hooks.ts', async () => {
    return {
        useFlightSummary: mocks.useFlightSummary,
        getFlightSummary: mocks.getFlightSummary
    }
})

describe("Flight Summary Integration", async () => {
    it("Should show the dialog when an entry is clicked, and hide it when closed", async () => {

        mocks.useFlightSummary.mockImplementation(() => {
            return {[testEntry.uuid]: testEntry}
        })
        render(<FlightSummary hasNavbar={false} />);
        expect(screen.queryAllByTestId("fs-evt-start-time")).toHaveLength(0);
        act(() => {
            screen.getByText("Test Event").click();
        })

        await waitFor(() => {
            expect(screen.queryAllByText("Close")).toHaveLength(1);
            expect(screen.queryAllByTestId("fs-evt-start-time")).toHaveLength(1);
        }, { timeout: 100, interval: 10 });

        act(() => {
            screen.getByText("Close").click();
        })

        await waitFor(() => {
            expect(screen.queryAllByText("Close")).toHaveLength(0);
            expect(screen.queryAllByTestId("fs-evt-start-time")).toHaveLength(0);
        })
    })
})