import { useDispatch, useSelector } from "@/redux/store"
import { ParameterDispatcher } from "./parameter-dispatcher"
import { ParameterFilter } from "./parameter-filter"
import { ParameterTable } from "./parameter-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlotDispatcher from "@/plot/plot"
import { X } from "lucide-react"
import { useState } from "react"
import { removeTab, renameTab, selectTab } from "@/redux/tabsSlice"
import { Input } from "@/components/ui/input"

const TabTitle = ({ tabIndex }: { tabIndex: number }) => {
    const dispatch = useDispatch()
    const tab = useSelector(state => state.tabs.tabs)[tabIndex]
    const [editMode, setEditMode] = useState(false)

    if (editMode) {
        return (
            <Input
                autoFocus
                value={tab.name}
                onChange={(e) => { dispatch(renameTab({ index: tabIndex, name: e.target.value })) }}
                onBlur={() => setEditMode(false)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                    if (e.key === "Enter") setEditMode(false)
                }}
                className="w-32 h-1 rounded-sm"
            />
        )
    }

    return (
        <span onDoubleClick={() => setEditMode(true)} className="flex items-center">
            {tab.name}
            <X size={14} className="ml-2" onClick={() => dispatch(removeTab(tabIndex))} />
        </span>
    )
}

const TabbedContent = () => {
    const tabs = useSelector(state => state.tabs.tabs)
    const selectedTab = useSelector(state => state.tabs.selectedTab)
    const dispatch = useDispatch()


    return (
        <Tabs value={selectedTab} onValueChange={(value) => { dispatch(selectTab(value)) }} className="w-full z-50">
            <div className="flex w-full justify-center m-auto">
                <TabsList>
                    <TabsTrigger value="param-list">Param List</TabsTrigger>
                    {
                        tabs.map((tab, index) => (
                            <TabsTrigger key={index} value={tab.id}>
                                <TabTitle tabIndex={index} />
                            </TabsTrigger>
                        ))
                    }
                </TabsList>
            </div>
            <TabsContent value="param-list">
                <ParameterFilter />
                <ParameterTable />
            </TabsContent>
            {
                tabs.map((tab, index) => (
                    <TabsContent key={index} value={tab.id}>
                        <div>
                            <PlotDispatcher {...tab} containerStyle={{ position: "fixed", top: 90, bottom: 0, left: 0, right: 0 }} />
                        </div>
                    </TabsContent>
                ))
            }
        </Tabs>
    )
}

const TabbbedParameterPage = () => {
    const nTabs = useSelector(state => state.tabs.tabs).length
    const tabbedPlots = useSelector(state => state.config.tabbedPlots)

    if (!nTabs || !tabbedPlots) {
        return (
            <ParameterDispatcher>
                <ParameterFilter />
                <ParameterTable />
            </ParameterDispatcher>
        )
    }

    return (
        <ParameterDispatcher>
            <TabbedContent />
        </ParameterDispatcher>
    )
}

export { TabbbedParameterPage as ParameterPage }