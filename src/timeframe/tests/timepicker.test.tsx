import { it, expect, describe, vi } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";

import { TimePicker } from "../timepicker";
import { setCustomTimeframe } from "@/redux/optionsSlice";
import { renderWithStore } from "@/tests";

describe("Test Timepicker component", () => {

    it("Should render with correct title", () => {
        renderWithStore(<TimePicker title="TestPicker" boundary="start" />)
        expect(screen.getByText("TestPicker")).toBeDefined()
    })

    it("Should render three inputs", () => {
        renderWithStore(<TimePicker title="TestPicker" boundary="start" />)
        expect(screen.queryAllByRole('textbox').length).toBe(3)
    })

    it("Should render the start time if boundary is start", async () => {
        const start = new Date("2024-01-01T11:12:13.000Z")
        const { store } = renderWithStore(<TimePicker title="TestPicker" boundary="start" />)

        act(() => store.dispatch(setCustomTimeframe({ start: start.getTime() })))

        await waitFor(() => {
            expect(screen.getByDisplayValue(start.getUTCHours().toString())).toBeDefined()
            expect(screen.getByDisplayValue(start.getUTCMinutes().toString())).toBeDefined()
            expect(screen.getByDisplayValue(start.getUTCSeconds().toString())).toBeDefined()
        })
    })

    it("Should render the end time if boundary is end", async () => {
        const end = new Date("2024-01-01T11:12:13.000Z")
        const { store } = renderWithStore(<TimePicker title="TestPicker" boundary="end" />)

        act(() => store.dispatch(setCustomTimeframe({ end: end.getTime() })))

        await waitFor(() => {
            expect(screen.getByDisplayValue(end.getUTCHours().toString())).toBeDefined()
            expect(screen.getByDisplayValue(end.getUTCMinutes().toString())).toBeDefined()
            expect(screen.getByDisplayValue(end.getUTCSeconds().toString())).toBeDefined()
        })
    })

    it("Should zero pad the time values", async () => {
        const start = new Date("2024-01-01T07:08:09.000Z")
        const { store } = renderWithStore(<TimePicker title="TestPicker" boundary="start" />)

        act(() => store.dispatch(setCustomTimeframe({ start: start.getTime() })))

        await waitFor(() => {
            expect(screen.getByDisplayValue("0" + start.getUTCMinutes().toString())).toBeDefined()
            expect(screen.getByDisplayValue("0" + start.getUTCSeconds().toString())).toBeDefined()
            expect(screen.getByDisplayValue("0" + start.getUTCHours().toString())).toBeDefined()
        })
    })

    it("Should update the start time when the input is changed", async () => {
        vi.setSystemTime(new Date("2024-01-01T07:08:09.000Z"))
        const { store } = renderWithStore(<TimePicker title="TestPicker" boundary="start" />)
        const [hours, minutes, seconds] = screen.getAllByRole('textbox')

        act(() => {
            fireEvent.change(hours, { target: { value: "12" } })
            fireEvent.change(minutes, { target: { value: "34" } })
            fireEvent.change(seconds, { target: { value: "56" } })
        })

        await waitFor(() => {
            expect(store.getState().options.customTimeframe).toEqual({
                start: new Date("2024-01-01T12:34:56.000Z").getTime(),
                end: null
            })
        })
    })

    it("Should update the end time when the input is changed", async () => {

        const { store } = renderWithStore(<TimePicker title="TestPicker" boundary="end" />)

        act(() => {
            store.dispatch(setCustomTimeframe({
                start: new Date("2024-01-01T07:08:09.000Z").getTime(),
                end: new Date("2024-01-01T07:08:09.000Z").getTime()
            }))
        })

        await waitFor(() => {
            const [hours, minutes, seconds] = screen.getAllByRole('textbox')

            fireEvent.change(hours, { target: { value: "12" } })
            fireEvent.change(minutes, { target: { value: "34" } })
            fireEvent.change(seconds, { target: { value: "56" } })

            const storeEnd = store.getState().options.customTimeframe.end
            expect(storeEnd).toEqual(new Date("2024-01-01T12:34:56.000Z").getTime())
        })
    })

    it("Should render a button if ongoing is allowed", () => {
        renderWithStore(<TimePicker title="TestPicker" boundary="start" allowOngoing />)
        expect(screen.getByText("Ongoing?")).toBeDefined()
    })

    it("Should toggle a null end time when the button is clicked", async () => {
        const { store } = renderWithStore(<TimePicker title="TestPicker" boundary="start" allowOngoing />)
        act(() => {
            store.dispatch(setCustomTimeframe({
                start: new Date("2024-01-01T07:08:09.000Z").getTime(),
                end: new Date("2024-01-01T07:08:09.000Z").getTime()
            }))
        })

        const button = screen.getByText("Ongoing?")
        act(() => fireEvent.click(button))

        await waitFor(() => {
            expect(store.getState().options.customTimeframe.end).toBeNull()
        })

        fireEvent.click(button)
        await waitFor(() => {
            expect(store.getState().options.customTimeframe.end).not.toBeNull()
        })
    })

})