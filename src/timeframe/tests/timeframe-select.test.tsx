import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { TimeframeSelectCard } from "../timeframe-select";
import { setupTestStore } from "@/tests";
import { setQuickLookMode } from "@/redux/configSlice";

describe("Test TimeframeSelectCard component", () => {

    const storeRef = setupTestStore()

    it("Should render", () => {
        render(<TimeframeSelectCard />, { wrapper: storeRef.Wrapper })
        expect(screen.getByText("Select a timeframe")).toBeDefined()
    })

    it("Should render start and end time pickers", () => {
        render(<TimeframeSelectCard />, { wrapper: storeRef.Wrapper })
        expect(screen.getByText("Start Time")).toBeDefined()
        expect(screen.getByText("End Time")).toBeDefined()
    })

    it("Should not render a 'Reset to entire dataset' button when quicklook mode is disabled", async () => {
        render(<TimeframeSelectCard />, { wrapper: storeRef.Wrapper })
        await waitFor(() => {
            expect(screen.queryByText("Reset to entire dataset")).toBeNull()
        })
    })

    it("Should render a 'Reset to entire dataset' button when quicklook mode is enabled", async () => {
        storeRef.store.dispatch(setQuickLookMode(true))
        render(<TimeframeSelectCard />, { wrapper: storeRef.Wrapper })
        await waitFor(() => {
            expect(screen.getByText("Reset to entire dataset")).toBeDefined()
        })
    })

    it("Should not allow ongoing timeframes in quicklook mode", async () => {
        storeRef.store.dispatch(setQuickLookMode(true))
        render(<TimeframeSelectCard />, { wrapper: storeRef.Wrapper })
        await waitFor(() => {
            expect(screen.queryAllByText("Ongoing")).toHaveLength(0)
        })
    })
})