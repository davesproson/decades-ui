import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent, act, waitFor } from '@testing-library/react'

// import { ParameterPage } from '../parameter-page'
import { testComponents } from '../parameter-page'
import { testTab } from './testdata'
import { Provider } from 'react-redux'
import { addTab, removeTab, selectTab } from '@/redux/tabsSlice'
import { createStore } from '@/redux/store'
import store from '@/redux/store'

function setupTestStore() {
    const refObj = {} as {
        store: typeof store,
        Wrapper: { ({ children }: any): JSX.Element }
    }

    beforeEach(() => {
        const _store = createStore()
        refObj.store = _store
        refObj.Wrapper = function Wrapper({ children }: any) {
            return <Provider store={store}>{children}</Provider>
        }
    })

    return refObj
}

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

    it("Should render an input when double-clicked", () => {
        const { TabTitle } = testComponents
        render(<TabTitle tab={testTab} onChangeTitle={() => { }} onRemove={() => { }} />)
        const title = screen.getByText(testTab.name)
        act(() => { fireEvent.dblClick(title) })
        waitFor(() => {
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

    it("Should call onRemove when remove button is clicked", () => {
        const { TabTitle } = testComponents
        const onRemove = vi.fn()
        render(<TabTitle tab={testTab} onChangeTitle={() => { }} onRemove={onRemove} />)
        const removeButton = screen.getByRole('button')
        act(() => fireEvent.click(removeButton))
        waitFor(() => {
            expect(onRemove).toHaveBeenCalled()
        })
    })

    it("Should hide input when enter is pressed", () => {
        const { TabTitle } = testComponents
        render(<TabTitle tab={testTab} onChangeTitle={() => { }} onRemove={() => { }} />)
        const title = screen.getByText(testTab.name)
        act(() => { fireEvent.dblClick(title) })
        const input = screen.getByRole('textbox')
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
        waitFor(() => {
            expect(screen.queryByRole('textbox')).toBeNull()
        })
    });

    it("Should hide input when input is blurred", () => {
        const { TabTitle } = testComponents
        render(<TabTitle tab={testTab} onChangeTitle={() => { }} onRemove={() => { }} />)
        const title = screen.getByText(testTab.name)
        act(() => { fireEvent.dblClick(title) })
        const input = screen.getByRole('textbox')
        fireEvent.blur(input)
        waitFor(() => {
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

    it("Should add a plot tab when config added to store", () => {

        const { TabbedContent } = testComponents
        render(<TabbedContent />, { wrapper: storeRef.Wrapper })

        const { id, ...rest } = testTab
        storeRef.store.dispatch(addTab(rest))
        waitFor(() => {
            expect(screen.getByText(testTab.name)).toBeDefined()
            expect(mocks.PlotDispatcher).toHaveBeenCalled()
        })
    })

    it("Should remove a plot tab when config removed from store", () => {
        const { TabbedContent } = testComponents
        render(<TabbedContent />, { wrapper: storeRef.Wrapper })

        const { id, ...rest } = testTab
        storeRef.store.dispatch(addTab(rest))
        waitFor(() => {
            expect(screen.getByText(testTab.name)).toBeDefined()
        })

        storeRef.store.dispatch(removeTab(1))
        waitFor(() => {
            expect(screen.queryByText(testTab.name)).toBeNull()
        })
    })

    it("Should switch to a plot when clicked", () => {
        const { TabbedContent } = testComponents
        const { id, ...rest } = testTab
        
        mocks.PlotDispatcher.mockClear()
        storeRef.store.dispatch(addTab(rest))
        storeRef.store.dispatch(selectTab("param-list"))
        render(<TabbedContent />, { wrapper: storeRef.Wrapper })

        waitFor(() => {
            expect(screen.getByText(testTab.name)).toBeDefined()
            expect(mocks.PlotDispatcher).not.toHaveBeenCalled()
            expect(screen.getByText("PlotlyPlot")).toBeNull()
        })

        waitFor(() => {
            act(() => {
                screen.getByText(testTab.name).click()
            })
        })

        waitFor(() => {
            expect(mocks.PlotDispatcher).toHaveBeenCalled()
            expect(screen.getByText("PlotlyPlot")).toBeDefined()
        })
    })


})