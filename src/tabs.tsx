import { removeTab, renameTab, selectTab } from './redux/tabsSlice';
import { Input } from './components/forms';
import { useDispatch, useSelector } from './redux/store';
import PlotDispatcher from './plot/plot';
import ParameterTable from './parameters/params';
import { useState } from 'react';

type TypeMapType = {
    [key: string]: React.FC<any>
}


const CloseButton = ({ tabIndex }: { tabIndex: number }) => {
    const dispatch = useDispatch()

    const closeTab = () => {
        dispatch(removeTab(tabIndex))
    }

    if (tabIndex === 0) return null
    return (
        <div style={{ position: "fixed", top: 70, left: 15, zIndex: 9 }}>
            <button className="delete ml-1" aria-label="delete" onClick={closeTab}></button>
        </div>
    )
}

const MainTabContent = () => {
    const tabs = useSelector(state => state.tabs.tabs)
    const selectedTab = useSelector(state => state.tabs.selectedTab)
    const typeMap: TypeMapType = {
        "plot": PlotDispatcher,
    }

    if (selectedTab === -1) return null

    const childStyle: React.CSSProperties = selectedTab === 0
        ? {}
        : { position: "absolute", inset: 0, top: 100 }

    const Component = selectedTab === 0
        ? ParameterTable
        : typeMap[tabs[selectedTab - 1].type]

    return (<div style={childStyle}>
        <Component {...tabs[selectedTab - 1]} />
    </div>
    )
}

const TabTitle = ({ name, index }: { name: string, index: number }) => {
    const [editing, setEditing] = useState(false)
    const dispatch = useDispatch()

    if (!editing) return <span onDoubleClick={() => setEditing(true)}>{name}</span>
    return (
        <Input
            style={{ width: 130 }}
            autoFocus
            value={name}
            onChange={(e) => { dispatch(renameTab({ index, name: e.target.value })) }}
            onBlur={() => setEditing(false)}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
                if (e.key === "Enter") setEditing(false)
            }}
        />

    )
}

const TabPanel = () => {
    const selectedTab = useSelector(state => state.tabs.selectedTab)
    const tabs = useSelector(state => state.tabs.tabs)
    const dispatch = useDispatch()

    return (
        <>
            <div className="tabs is-centered has-navbar-fixed-top has-background-white" style={{ position: "fixed", width: "100%", zIndex: 1, top: "55px", height: "50px", padding: 0 }}>
                <ul>
                    <li className={selectedTab === 0 ? "is-active" : ""}>
                        <a onClick={() => dispatch(selectTab(0))}>
                            <strong>Parameters</strong>
                        </a>
                    </li>
                    {tabs.map((_c, i) => {
                        return (<li key={i} className={i + 1 === selectedTab ? "is-active" : ""}>
                            <a onClick={() => {
                                if (i + 1 === selectedTab) return
                                // This is a horrible hack to get the tab to refresh when it is clicked.
                                // It's required because the plotly hooks are reacting correctly.
                                // TODO: Do something better here.
                                dispatch(selectTab(-1)); setTimeout(() => dispatch(selectTab(i + 1)), 0)
                            }
                            }>
                                <TabTitle index={i} name={tabs[i].name} />
                            </a>
                        </li>)
                    })}
                </ul>
            </div>
            <CloseButton tabIndex={selectedTab} />
            <MainTabContent />
        </>
    )
}

export default TabPanel;