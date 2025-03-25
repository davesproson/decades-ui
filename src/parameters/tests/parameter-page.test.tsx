import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, act, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { testComponents } from '../parameter-page'
import { testTab } from './testdata'
import { addTab, removeTab, selectTab } from '@/redux/tabsSlice'
import { renderWithStore } from '@/tests'
import { setTabbedPlots } from '@/redux/configSlice'
import { ParameterPage } from '../parameter-page'
import { setFilterText } from '@/redux/filterSlice'


const mocks = vi.hoisted(() =>{
    return {
        PlotDispatcher: vi.fn(() => <>PlotlyPlot</>),
        ParameterDispatcher: vi.fn((props) =><>{props.children}</>)
    }
})

vi.mock('@/plot/plot', async () => {
    return {
        default: mocks.PlotDispatcher,
        PlotDispatcher: mocks.PlotDispatcher
    }
})

vi.mock('@/parameters/parameter-dispatcher', async () => {
    return {
        default: mocks.ParameterDispatcher,
        ParameterDispatcher: mocks.ParameterDispatcher
    }
})

describe("Test tabbed parameter tab title", () => {

    beforeEach(() => {
        cleanup()
        mocks.PlotDispatcher.mockClear()
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

describe("Test flappyplane easter egg",  async () => {
    beforeEach(() => {
        cleanup();
        mocks.ParameterDispatcher.mockClear();
    })

    it("Should render FlappyPlane only when filtertext is 'flappyplane'", async () => {

        const { store } = renderWithStore(<ParameterPage />)

        act(() => {
            store.dispatch(setFilterText({ filterText: "flappyplane" }))
        })
        
        await waitFor(() => {
            expect(screen.getByText("Flappy Plane")).toBeDefined()
        })

        act(() => {
            store.dispatch(setFilterText({ filterText: "" }))
        })

        await waitFor(() => {
            expect(screen.queryByText("Flappy Plane")).toBeNull()
        })
    })

    it("Should reset filtertext when the exit button is clicked", async () => {
        const { store } = renderWithStore(<ParameterPage />)

        act(() => {
            store.dispatch(setFilterText({ filterText: "flappyplane" }))
        })

        await waitFor(() => {
            expect(screen.getByText("Flappy Plane")).toBeDefined()
        })

        act(() => {
            userEvent.click(screen.getByTestId("fp-exit-button"))
        })

        await waitFor(() => {
            expect(screen.getByText("Clear Selection")).toBeDefined()
        })
    })
})

describe("Test tabbed parameter content", () => {

    beforeEach(() => {
        cleanup()
    })
    
    it("Should render", () => {
        const { TabbedContent } = testComponents
        renderWithStore(<TabbedContent />)
        expect(screen.getByText("Param List")).toBeDefined()
    })

     it("Should add a plot tab when config added to store", async () => {
        
         const { TabbedContent } = testComponents
         const { id, name, ...rest } = testTab
         const { store } = renderWithStore(<TabbedContent />)

         act(() => {
  		    store.dispatch(setTabbedPlots(true))
  	        store.dispatch(addTab(rest))
         })

         await waitFor(() => {
             expect(screen.getByText("Plot 1")).toBeDefined()
             expect(mocks.PlotDispatcher).toHaveBeenCalled()
         })
     })

    it("Should remove a plot tab when config removed from store", async () => {
        const { TabbedContent } = testComponents
        const { store } = renderWithStore(<TabbedContent />)

        const { id, name, ...rest } = testTab

        act(() => {
            store.dispatch(addTab(rest))
            store.dispatch(setTabbedPlots(true))
        })

        await waitFor(() => {
            expect(screen.getByText("Plot 1")).toBeDefined()
        })

        act(() => store.dispatch(removeTab(0)))

        await waitFor(() => {
            expect(screen.queryAllByText("Plot 1")).toHaveLength(0)
        })
    })

    it("Should switch to a plot when clicked", async () => {
        const user = userEvent.setup()
        const { TabbedContent } = testComponents
        const { id, name,  ...rest } = testTab
        
        const { store } = renderWithStore(<TabbedContent />)

        act(() => {
            store.dispatch(addTab(rest))
            store.dispatch(selectTab("param-list"))
        })

        mocks.PlotDispatcher.mockClear()

        await waitFor(() => {
            expect(screen.getByText("Plot 1")).toBeDefined()
            expect(screen.queryAllByText("PlotlyPlot")).toHaveLength(0)
            expect(mocks.PlotDispatcher).not.toHaveBeenCalled()
        })

        
        act(() => {
            user.click(screen.getByText("Plot 1"))
        })
        
        await waitFor(() => {
            expect(screen.getByText("PlotlyPlot")).toBeDefined()
            expect(mocks.PlotDispatcher).toHaveBeenCalled()
        })
    })


})