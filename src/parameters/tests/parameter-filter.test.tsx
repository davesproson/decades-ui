import { it, expect, describe, vi } from "vitest";
import { act, fireEvent, render, screen } from '@testing-library/react';
import { testComponents } from '../parameter-filter';

describe("Test parameter refresh button", () => {
    it("Should render", () => {
        const { ParameterRefreshButton } = testComponents
        render(<ParameterRefreshButton enabled={true} spin={false} onClick={()=>{}}/>)
        expect(screen.getByRole("button")).toBeDefined()
    })

    it("Should call onRefresh when clicked", () => {
        const { ParameterRefreshButton } = testComponents
        const onClick = vi.fn()
        render(<ParameterRefreshButton enabled={true} spin={false} onClick={onClick}/>)
        act(() => {
            screen.getByRole("button").click()
        })
        expect(onClick).toHaveBeenCalledOnce()
    })

    it("Should render a spinner", () => {
        const { ParameterRefreshButton } = testComponents
        render(<ParameterRefreshButton enabled={true} spin={true} onClick={()=>{}}/>)
        expect(screen.getByRole("button").querySelector("svg")).toBeDefined()
        expect(screen.getByRole("button").querySelector("svg")).toHaveClass("lucide-refresh-cw")
    })

    it("Should have class 'animate-spin' when spinning", () => {
        const { ParameterRefreshButton } = testComponents
        render(<ParameterRefreshButton enabled={true} spin={true} onClick={()=>{}}/>)
        expect(screen.getByRole("button").querySelector("svg")).toHaveClass("animate-spin")
    })

})

describe("Test parameter clear button", () => {
    it("Should render", () => {
        const { ParameterTextClearButton } = testComponents
        render(<ParameterTextClearButton onClick={()=>{}}/>)
        expect(screen.getByRole("button")).toBeDefined()
    })

    it("Should call onClick when clicked", () => {
        const { ParameterTextClearButton } = testComponents
        const onClick = vi.fn()
        render(<ParameterTextClearButton onClick={onClick}/>)
        act(() => {
            screen.getByRole("button").click()
        })
        expect(onClick).toHaveBeenCalledOnce()
    })
})

describe("Test parameter filter input box", () => {

    it("Should render", () => {
        const { ParameterFilterInputBox } = testComponents
        render(<ParameterFilterInputBox value={""} onChange={()=>{}}/>)
        expect(screen.getByRole("textbox")).toBeDefined()
    })

    it("Should call onChange when text is entered", () => {
        const { ParameterFilterInputBox } = testComponents
        const onChange = vi.fn()
        render(<ParameterFilterInputBox value={""} onChange={onChange}/>)
        act(() => {
            fireEvent.change(screen.getByRole("textbox"), {target: {value: "test"}})
        })
        expect(onChange).toHaveBeenCalled()
    })
})