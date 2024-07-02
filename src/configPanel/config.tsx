import "../../assets/css/transition.css";
import OptionSwitch from "../components/optionSwitch";

import { useRef } from "react";
import { useDarkMode } from "../hooks";
import { useDispatch, useSelector } from "../redux/store"

import { resetParams, setParamSet } from "../redux/parametersSlice";

import { Button } from "../components/buttons";
import { LiveDataOnly } from "../quicklook";
import { Option, OptionList } from "./components";
import { ChatConfigSwitch } from "../chat/chat";
import { BleedingEdge } from "../components/bleeding";

import { enableChat, enableQuicklook, enableTabbedPlots } from "../settings";
import { useLocalStorage } from "usehooks-ts";
import { setQuickLookMode, toggleTabbedPlots } from "../redux/configSlice";

// These should be pulled from the server.
const PARAMETER_SETS = [{
    name: "Default",
    paramset: ""
}, {
    name: "Core Chem. Housekeeping",
    paramset: "corechem"
}]



const DarkModeSwitch = () => {
    const [darkMode, setDarkMode] = useDarkMode();
    const _setDarkMode = (value: boolean) => {
        setDarkMode(value);
        // The return value is irrelevant, but it must be an this shape.
        return { "type": "darkMode", "value": value };
    }

    return <OptionSwitch
        value={darkMode ? "On" : "Off"}
        options={["On", "Off"]}
        toggle={() => _setDarkMode(!darkMode)}
        useStore={false}
        small
    />
}

const TabbedPlotsSwitch = () => {
    const tabbedPlots = useSelector(state => state.config.tabbedPlots);
    return <OptionSwitch
        value={tabbedPlots ? "On" : "Off"}
        options={["On", "Off"]}
        toggle={toggleTabbedPlots}
        useStore={true}
        small
    />
}

const DataModeSwitch = () => {
    const dispatch = useDispatch();
    const quickLookMode = useSelector(state => state.config.quickLookMode);
    return <OptionSwitch
        value={quickLookMode ? "Quicklook" : "Live Data"}
        options={["Live Data", "Quicklook"]}
        toggle={() => {
            dispatch(setQuickLookMode(!quickLookMode));
            dispatch(resetParams());
            return { type: "quickLookMode", value: quickLookMode }
        }}
        useStore={false}
        small
    />
}

const NewStyleDashboard = () => {
    const [useNewDashboard, setUseNewDashboard] = useLocalStorage<boolean>("useNewDashboard", true);
    return <OptionSwitch
        value={useNewDashboard ? "New" : "Old"}
        options={["New", "Old"]}
        toggle={()=>{
            setUseNewDashboard(x=>!x);
            return { type: "useNewDashboard", value: useNewDashboard }
        }}
        small
    />
}

const ParamSetSelector = () => {
    const dispatch = useDispatch();
    const paramSet = useSelector(state => state.vars.paramSet);

    return <div className="control">
        <div className="select">
            <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                dispatch(setParamSet(e.target.value))
            }} value={paramSet}>
                {
                    PARAMETER_SETS.map((x, i) => {
                        return <option key={i} value={x.paramset}>{x.name}</option>
                    })
                }

            </select>
        </div>
    </div>
}

interface NavbarButtonProps {
    toggleSlide: () => void,
}
const NavbarButton = (props: NavbarButtonProps) => {
    return <Button outlined extraClasses="mt-2" style={{ border: "none" }}
        onClick={props.toggleSlide}>
        <svg xmlns="http://www.w3.org/2000/svg" className="" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>
    </Button>
}

const ConfigPanel = () => {
    const ref = useRef<HTMLDivElement>(null);

    const toggleSlide = () => {
        if (ref.current) {
            ref.current.classList.toggle("slide-out");
            ref.current.classList.toggle("slide-in");
        }
    }

    return (
        <>
            <NavbarButton toggleSlide={toggleSlide} />
            <div ref={ref}
                style={{
                    position: "fixed",
                    top: "64px",
                    bottom: 0,
                    width: "300px",
                }}
                className="slide-out config-panel">
                <div className="m-2">
                    <h1 className="title">
                        <a className="has-text-black" href="#" onClick={toggleSlide}>Options</a>
                    </h1>
                    <OptionList>
                        <Option title="Dark Mode">
                            <DarkModeSwitch />
                        </Option>

                        <BleedingEdge show={enableQuicklook}>
                            <Option title="Mode">
                                <DataModeSwitch />
                            </Option>
                        </BleedingEdge>

                        <LiveDataOnly>
                            <Option title="Parameter Set">
                                <ParamSetSelector />
                            </Option>
                        </LiveDataOnly>

                        <LiveDataOnly>
                            <BleedingEdge show={enableChat}>
                                <Option title="Chat" tag={{text: "Beta", is: "warning" }}>
                                    <ChatConfigSwitch />
                                </Option>
                            </BleedingEdge>
                        </LiveDataOnly>

                        <LiveDataOnly>
                            <Option title="Dashboard Style" tag={{text: "Beta", is: "warning" }}>
                                <NewStyleDashboard />
                            </Option>
                        </LiveDataOnly>

                        <BleedingEdge show={enableTabbedPlots}>
                            <Option title="Tabbed Plots" tag={{text: "Alpha", is: "danger" }}>
                                <TabbedPlotsSwitch />
                            </Option>
                        </BleedingEdge>
                    </OptionList>
                </div>
            </div>
        </>
    );
}

export { ConfigPanel };