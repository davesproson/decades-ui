import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import FlightSummary from "../flight-summary";
import { testEntry } from "./testdata";

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

vi.mock('@tanstack/react-router', () => {
    return {
        Link: ({ to }: { to: string }) => <div data-to={to}>Home</div>
    }
})


describe("Flight summary table", async () => {
    beforeEach(() => {
        cleanup();
    });

    it("Should render a message when no flight summary data is available", async () => {
        mocks.getFlightSummary.mockResolvedValue({})
        render(<FlightSummary hasNavbar={false} />);
        expect(screen.getByText("No flight summary yet!")).toBeDefined();
        expect(screen.queryByText("Home")).toBeNull();
    })

    it("Should render a home button when no flight summary data is available and hasNavbar is true", async () => {
        mocks.getFlightSummary.mockResolvedValue({})
        render(<FlightSummary hasNavbar={true} />);
        expect(screen.getByText("Home")).toBeDefined();
    })

    it("Should render a single entry correctly", async () => {
        mocks.useFlightSummary.mockImplementation(() => {
            return { [testEntry.uuid]: testEntry }
        })
        render(<FlightSummary hasNavbar={false} />);

        await waitFor(() => {
            expect(screen.getByText("Test Event")).toBeInTheDocument();
            expect(screen.getByText("Start time")).toBeInTheDocument();
            expect(screen.getByText("Start lat")).toBeInTheDocument();
            expect(screen.getByText("Start lon")).toBeInTheDocument();
            expect(screen.getByText("Start alt")).toBeInTheDocument();
            expect(screen.getByText("Start hdg")).toBeInTheDocument();
            expect(screen.getByText("End time")).toBeInTheDocument();
            expect(screen.getByText("End lat")).toBeInTheDocument();
            expect(screen.getByText("End lon")).toBeInTheDocument();
            expect(screen.getByText("End alt")).toBeInTheDocument();
            expect(screen.getByText("End hdg")).toBeInTheDocument();
            expect(screen.getByText("Test Comment")).toBeInTheDocument();
        }, { timeout: 100, interval: 10 });
    })

    it("Should highlight ongoing events", async () => {
        const highlightClass = "bg-blue-400 dark:bg-blue-600";
        mocks.useFlightSummary.mockImplementation(() => {
            return {
                [testEntry.uuid]: { ...testEntry, ongoing: true },
                [testEntry.uuid + 1]: { ...testEntry, uuid: testEntry.uuid + 1, ongoing: false, start: { time: testEntry.start.time - 1000 }, end: { time: testEntry.start.time - 500 } }
            }
        })
        render(<FlightSummary hasNavbar={false} />);

        await waitFor(() => {
            expect(screen.getAllByRole("row")[2]).toHaveClass(highlightClass);
            expect(screen.getAllByRole("row")[1]).not.toHaveClass(highlightClass);
        }, { timeout: 100, interval: 10 });
    })

    it("Should not render deleted entries", async () => {
        mocks.useFlightSummary.mockImplementation(() => {
            return {
                [testEntry.uuid]: { ...testEntry, deleted: true }
            }
        })
        render(<FlightSummary hasNavbar={false} />);

        await waitFor(() => {
            expect(screen.queryByText("Test Event")).toBeNull();
        }, { timeout: 100, interval: 10 });
    })
})

