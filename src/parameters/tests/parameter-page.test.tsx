import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent, act, waitFor } from '@testing-library/react'

// import { ParameterPage } from '../parameter-page'
import { testComponents } from '../parameter-page'
import { testTab } from './testdata'
import { addTab, removeTab, selectTab } from '@/redux/tabsSlice'
import { setupTestStore } from '@/tests'
import { setTabbedPlots } from '@/redux/configSlice'



const mocks = vi.hoisted(() =>{
    return {
        PlotDispatcher: vi.fn(() => <>PlotlyPlot</>)
    }
})

vi.mock('@/plot/plot', () => {
    return {
        PlotDispatcher: mocks.PlotDispatcher
    }
})

describe("Test tabbed parameter tab title", () => {

    beforeEach(() => {
        cleanup()
    })

    it("Should render", () => {
        const { TabTitle } = testComponents
        render(<TabTitle tab={testTab} onChangeTitle={() => { }} onRemove={() => { }} />)
        expect(screen.getByText(testTab.name)).toBeDefined()
    })

    it("Should render an input when double-clicked", async () => {
        const { TabTitle } = testComponents
        render(<TabTitle tab={testTab} onChangeTitle={() => { }} onRemove={() => { }} />)
        const title = screen.getByText(testTab.name)
        act(() => { fireEvent.dblClick(title) })
        await waitFor(() => {
            expect(screen.getAllByRole('textbox')).toBeDefined()
        })
    })

    it("Should call onChangeTitle when input is changed", () => {
        const { TabTitle } = testComponents
        const onChangeTitle = vi.fn()
        render(<TabTitle tab={testTab} onChangeTitle={onChangeTitle} onRemove={() => { }} />)
        const title = screen.getByText(testTab.name)
        act(() => { fireEvent.dblClick(title) })
        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: "New Title" } })
        expect(onChangeTitle).toHaveBeenCalled()
    })

    it("Should call onRemove when remove button is clicked", async () => {
        const { TabTitle } = testComponents
        const onRemove = vi.fn()
        render(<TabTitle tab={testTab} onChangeTitle={() => { }} onRemove={onRemove} />)
        const removeButton = screen.getByRole('button')
        act(() => fireEvent.click(removeButton))
        await waitFor(() => {
            expect(onRemove).toHaveBeenCalled()
        })
    })

    it("Should hide input when enter is pressed", async () => {
        const { TabTitle } = testComponents
        render(<TabTitle tab={testTab} onChangeTitle={() => { }} onRemove={() => { }} />)
        const title = screen.getByText(testTab.name)
        act(() => { fireEvent.dblClick(title) })
        const input = screen.getByRole('textbox')
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
        await waitFor(() => {
            expect(screen.queryByRole('textbox')).toBeNull()
        })
    });

    it("Should hide input when input is blurred", async () => {
        const { TabTitle } = testComponents
        render(<TabTitle tab={testTab} onChangeTitle={() => { }} onRemove={() => { }} />)
        const title = screen.getByText(testTab.name)
        act(() => { fireEvent.dblClick(title) })
        const input = screen.getByRole('textbox')
        fireEvent.blur(input)
        await waitFor(() => {
            expect(screen.queryByRole('textbox')).toBeNull()
        })
    })
})


describe("Test tabbed parameter content", () => {

    beforeEach(() => {
        cleanup()
    })
    
    const storeRef = setupTestStore()
    
    it("Should render", () => {
        const { TabbedContent } = testComponents
        render(<TabbedContent />, { wrapper: storeRef.Wrapper })
        expect(screen.getByText("Param List")).toBeDefined()
    })

    it("Should add a plot tab when config added to store", async () => {
        

        const { TabbedContent } = testComponents
        render(<TabbedContent />, { wrapper: storeRef.Wrapper })
        storeRef.store.dispatch(setTabbedPlots(true))
        const { id, name, ...rest } = testTab
        storeRef.store.dispatch(addTab(rest))

        await waitFor(() => {
            expect(screen.getByText("Plot 1")).toBeDefined()
            expect(mocks.PlotDispatcher).toHaveBeenCalled()
        })
    })

    it("Should remove a plot tab when config removed from store", async () => {
        const { TabbedContent } = testComponents
        render(<TabbedContent />, { wrapper: storeRef.Wrapper })

        const { id, name, ...rest } = testTab
        storeRef.store.dispatch(addTab(rest))
        storeRef.store.dispatch(setTabbedPlots(true))
        await waitFor(() => {
            expect(screen.getByText("Plot 1")).toBeDefined()
        })

        storeRef.store.dispatch(removeTab(1))
        await waitFor(() => {
            expect(screen.queryAllByText("Plot 1")).toHaveLength(0)
        })
    })

    it("Should switch to a plot when clicked", async () => {
        const { TabbedContent } = testComponents
        const { id, ...rest } = testTab
        
        mocks.PlotDispatcher.mockClear()
        storeRef.store.dispatch(addTab(rest))
        storeRef.store.dispatch(selectTab("param-list"))
        render(<TabbedContent />, { wrapper: storeRef.Wrapper })

        await waitFor(() => {
            expect(screen.getByText(testTab.name)).toBeDefined()
            expect(mocks.PlotDispatcher).not.toHaveBeenCalled()
            expect(screen.getByText("PlotlyPlot")).toBeNull()
        })
        
        act(() => {
            screen.getByText(testTab.name).click()
        })

        await waitFor(() => {
            expect(mocks.PlotDispatcher).toHaveBeenCalled()
            expect(screen.getByText("PlotlyPlot")).toBeDefined()
        })
    })


})