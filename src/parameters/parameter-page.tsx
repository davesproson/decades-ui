import { useDispatch, useSelector } from "@/redux/store"
import { ParameterDispatcher } from "./parameter-dispatcher"
import { ParameterFilter } from "./parameter-filter"
import { ParameterTable } from "./parameter-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlotDispatcher from "@/plot/plot"
import { X } from "lucide-react"
import { useState, lazy, Suspense } from "react"
import { removeTab, renameTab, selectTab } from "@/redux/tabsSlice"
import { Input } from "@/components/ui/input"
import type { TabEntry } from "@/redux/tabsSlice"
import Loader from "@/components/loader"

// import FlappyPlane from "@/flappyplane/flappy-plane"

const kwikhash = (str: string) => {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}

type TabTitleProps = {
    tab: TabEntry,
    onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onRemove: () => void
}
const TabTitle = ({ tab, onChangeTitle, onRemove }: TabTitleProps) => {
    const [editMode, setEditMode] = useState(false)

    if (editMode) {
        return (
            <Input
                autoFocus
                value={tab.name}
                onChange={onChangeTitle}
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
            <X size={14} className="ml-2" onClick={onRemove} role="button" />
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
                                <TabTitle
                                    tab={tab}
                                    onChangeTitle={(e) => dispatch(renameTab({ index, name: e.target.value }))}
                                    onRemove={() => dispatch(removeTab(index))} />
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
    const filterText = useSelector(state => state.paramfilter.filterText);

    if (kwikhash(filterText) === -65155874) {
        const FlappyPlane = lazy(() => import("@/flappyplane/flappy-plane"));
        return (
            <Suspense fallback={<Loader />}>
                <FlappyPlane />
            </Suspense>
        )
    }

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

export const testComponents = {
    TabTitle,
    TabbedContent
}

export { TabbbedParameterPage as ParameterPage }