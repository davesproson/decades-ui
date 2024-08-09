import { describe, it, expect } from "vitest";
import { TabbedPlotsSwitch } from "../tabbed-plots-select";
import { renderWithStore } from "@/tests";
import { act, waitFor } from "@testing-library/react";

describe('Test tabbed plots select', async () => {

    it('Should render tabbed plots select', async () => {
        const { getByText } = renderWithStore(<TabbedPlotsSwitch />)
        expect(getByText('Tabbed Plots')).toBeInTheDocument()
    })

    it('Should toggle the tabbed plots mode when clicked', async () => {
        const { store, getByText } = renderWithStore(<TabbedPlotsSwitch />)
        expect(store.getState().config.tabbedPlots).toBe(false)
        
        act(() => getByText('Tabbed Plots').click())

        await waitFor(() => expect(store.getState().config.tabbedPlots).toBe(true))

        act(() => getByText('Tabbed Plots').click())

        waitFor(() => expect(store.getState().config.tabbedPlots).toBe(false))
    })
})