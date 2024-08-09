import { describe, it, expect, vi, afterAll } from "vitest";
import { ParamSetSelector } from "../paramset-select";
import { renderWithStore } from "@/tests";
import { testConstants } from "../paramset-select";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mocking the HTMLElement prototype as it is not available in jsdom
global.HTMLElement.prototype.scrollIntoView = vi.fn();
global.HTMLElement.prototype.hasPointerCapture = vi.fn();

describe('Test paramset selector', async () => {

    afterAll(() => {
        vi.resetAllMocks()
    })

    it("Should render paramset selector", async () => {
        const { getByText } = renderWithStore(<ParamSetSelector />)
        expect(getByText("Select Parameter Set...")).not.toBeNull()
    })

    it("Should change paramset when clicked", async () => {
        const user = userEvent.setup()
        const { store, getByText  } = renderWithStore(<ParamSetSelector />)

        expect(store.getState().vars.paramSet).toBe("")

        await user.click(getByText("Select Parameter Set..."))
        
        await waitFor(() => {
            expect(getByText(testConstants.PARAMETER_SETS[1].name)).toBeInTheDocument()
        })

        await user.click(getByText(testConstants.PARAMETER_SETS[1].name))

        expect(store.getState().vars.paramSet).toBe(
            testConstants.PARAMETER_SETS[1].paramset
        )
    })
})