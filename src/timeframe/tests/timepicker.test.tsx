import { setupTestStore } from "@/tests";
import { it, expect, describe } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { TimePicker } from "../timepicker";
import { setCustomTimeframe } from "@/redux/optionsSlice";

describe("Test Timepicker component", () => {
    const storeRef = setupTestStore()

    it("Should render with correct title", () => {
        render(<TimePicker title="TestPicker" boundary="start" />, { wrapper: storeRef.Wrapper })
        expect(screen.getByText("TestPicker")).toBeDefined()
    })

    it("Should render three inputs", () => {
        render(<TimePicker title="TestPicker" boundary="start" />, { wrapper: storeRef.Wrapper })
        expect(screen.queryAllByRole('textbox').length).toBe(3)
    })

    it("Should render the start time if boundary is start", async () => {
        const start = new Date("2024-01-01T11:12:13.000Z")
        storeRef.store.dispatch(setCustomTimeframe({ start: start.getTime() }))
        render(<TimePicker title="TestPicker" boundary="start" />, { wrapper: storeRef.Wrapper })
        await waitFor(() => {
            expect(screen.getByDisplayValue(start.getUTCHours().toString())).toBeDefined()
            expect(screen.getByDisplayValue(start.getUTCMinutes().toString())).toBeDefined()
            expect(screen.getByDisplayValue(start.getUTCSeconds().toString())).toBeDefined()
        })
    })

    it("Should render the end time if boundary is end", async () => {
        const end = new Date("2024-01-01T11:12:13.000Z")
        storeRef.store.dispatch(setCustomTimeframe({ end: end.getTime() }))
        render(<TimePicker title="TestPicker" boundary="end" />, { wrapper: storeRef.Wrapper })
        await waitFor(() => {
            expect(screen.getByDisplayValue(end.getUTCHours().toString())).toBeDefined()
            expect(screen.getByDisplayValue(end.getUTCMinutes().toString())).toBeDefined()
            expect(screen.getByDisplayValue(end.getUTCSeconds().toString())).toBeDefined()
        })
    })

    it("Should zero pad the time values", async () => {
        const start = new Date("2024-01-01T07:08:09.000Z'")

        storeRef.store.dispatch(setCustomTimeframe({ start: start.getTime() }))
        render(<TimePicker title="TestPicker" boundary="start" />, { wrapper: storeRef.Wrapper })
        await waitFor(() => {
            expect(screen.getByDisplayValue("0" + start.getUTCMinutes().toString())).toBeDefined()
            expect(screen.getByDisplayValue("0" + start.getUTCSeconds().toString())).toBeDefined()
            expect(screen.getByDisplayValue("0" + start.getUTCHours().toString())).toBeDefined()
        })
    })

    it("Should update the start time when the input is changed", async () => {
        render(<TimePicker title="TestPicker" boundary="start" />, { wrapper: storeRef.Wrapper })
        const [hours, minutes, seconds] = screen.getAllByRole('textbox')

        fireEvent.change(hours, { target: { value: "12" } })
        fireEvent.change(minutes, { target: { value: "34" } })
        fireEvent.change(seconds, { target: { value: "56" } })

        await waitFor(() => {
            expect(storeRef.store.getState().options.customTimeframe).toEqual({
                start: new Date("2024-01-01T12:34:56.000Z").getTime(),
                end: null
            })
        })
    })

    it("Should update the end time when the input is changed", async () => {
        storeRef.store.dispatch(setCustomTimeframe({
            start: new Date("2024-01-01T07:08:09.000Z").getTime(),
            end: new Date("2024-01-01T07:08:09.000Z").getTime()
        }))
        render(<TimePicker title="TestPicker" boundary="end" />, { wrapper: storeRef.Wrapper })

        await waitFor(() => {
            const [hours, minutes, seconds] = screen.getAllByRole('textbox')

            fireEvent.change(hours, { target: { value: "12" } })
            fireEvent.change(minutes, { target: { value: "34" } })
            fireEvent.change(seconds, { target: { value: "56" } })

            const storeEnd = storeRef.store.getState().options.customTimeframe.end
            expect(storeEnd).toEqual(new Date("2024-01-01T12:34:56.000Z").getTime())
        })
    })

    it("Should render a button if ongoing is allowed", () => {
        render(<TimePicker title="TestPicker" boundary="start" allowOngoing />, { wrapper: storeRef.Wrapper })
        expect(screen.getByText("Ongoing?")).toBeDefined()
    })

    it("Should toggle a null end time when the button is clicked", async () => {
        storeRef.store.dispatch(setCustomTimeframe({
            start: new Date("2024-01-01T07:08:09.000Z").getTime(),
            end: new Date("2024-01-01T07:08:09.000Z").getTime()
        }))
        render(<TimePicker title="TestPicker" boundary="start" allowOngoing />, { wrapper: storeRef.Wrapper })

        const button = screen.getByText("Ongoing?")
        fireEvent.click(button)

        await waitFor(() => {
            expect(storeRef.store.getState().options.customTimeframe.end).toBeNull()
        })

        fireEvent.click(button)
        await waitFor(() => {
            expect(storeRef.store.getState().options.customTimeframe.end).not.toBeNull()
        })
    })
})