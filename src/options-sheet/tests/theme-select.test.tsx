import { describe, it, expect, vi, Mock } from "vitest";
import { ThemeSelect } from "../theme-select";
import { ThemeProvider } from "@/components/theme-provider";
import { renderWithStore } from "@/tests";
import { waitFor } from "@testing-library/react";
import userEvent  from "@testing-library/user-event";

global.matchMedia = vi.fn(() => ({matches: false})) as Mock

describe('Test theme select', async () => {

    it('Should render theme select', async () => {
        const { getByText } = renderWithStore(<ThemeProvider><ThemeSelect /></ThemeProvider>)
        expect(getByText('Theme')).toBeInTheDocument()
    })

    it("Should show a theme menu when clicked", async () => {
        const user = userEvent.setup()
        const { getByText, getByRole } = renderWithStore(<ThemeProvider><ThemeSelect /></ThemeProvider>)
        
        await user.click(getByRole("button"))

        await waitFor(() => {
            expect(getByText("Dark")).toBeInTheDocument()
            expect(getByText("Light")).toBeInTheDocument()
            expect(getByText("System")).toBeInTheDocument()
        })

    })

    // TODO: integration test for changing theme
})