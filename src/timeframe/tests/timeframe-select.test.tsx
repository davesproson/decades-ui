import { describe, it, expect } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import { TimeframeSelectCard } from "../timeframe-select";
import { setQuickLookMode } from "@/redux/configSlice";
import { renderWithStore } from "@/tests"

describe("Test TimeframeSelectCard component", () => {


    it("Should render", () => {
        renderWithStore(<TimeframeSelectCard />)
        expect(screen.getByText("Select a timeframe")).toBeDefined()
    })

    it("Should render start and end time pickers", () => {
        renderWithStore(<TimeframeSelectCard />)
        expect(screen.getByText("Start Time")).toBeDefined()
        expect(screen.getByText("End Time")).toBeDefined()
    })

    it("Should not render a 'Reset to entire dataset' button when quicklook mode is disabled", async () => {
        renderWithStore(<TimeframeSelectCard />)
        await waitFor(() => {
            expect(screen.queryByText("Reset to entire dataset")).toBeNull()
        })
    })

    it("Should render a 'Reset to entire dataset' button when quicklook mode is enabled", async () => {
        const { store } = renderWithStore(<TimeframeSelectCard />)
        act(() => store.dispatch(setQuickLookMode(true)))
        await waitFor(() => {
            expect(screen.getByText("Reset to entire dataset")).toBeDefined()
        })
    })

    it("Should not allow ongoing timeframes in quicklook mode", async () => {
        const { store } = renderWithStore(<TimeframeSelectCard />)
        act(() => store.dispatch(setQuickLookMode(true)))
        await waitFor(() => {
            expect(screen.queryAllByText("Ongoing")).toHaveLength(0)
        })
    })
})