/**
 * This module provides components for configuring the advanced view. It goes
 * about this all backwards, by displaying the configured view recursively
 * wuth a bunch of dumb components, and then using the ref to get the data
 * back out from the DOM. This works, but it's not very elegant and should
 * be improved in the future.
 */

import React from 'react'
import { useState } from 'react';
import { useSelector, useDispatch } from '../redux/store';
import { setAdvancedConfig } from '../redux/viewSlice';
import { FieldInput } from '../components/forms';
import { Button } from '../components/buttons';
import { useDarkMode } from '../hooks';
import { AdvancedConfig } from '../redux/viewSlice';

import { useWidgets } from "./widgets/register"


interface ConfigWidgetProps {
    visible: boolean,
    split: (rows: number, cols: number, rowPc: number[], colPc: number[]) => void,
    hide: () => void,
    top: boolean,
    setData: (data: any) => void
}
/**
 * Display the configuration widget. 
 * 
 * @param {*} props - the react props
 * @param {boolean} props.visible - whether the widget is visible
 * @param {*} props.split - a callback to split the view
 * @param {*} props.hide - a callback to hide the widget
 * @param {*} props.setData - a callback to set the data for the view
 * @param {boolean} props.top - whether the widget is the ancestor view
 * 
 * @component
 * 
 */

const ConfigWidget = (props: ConfigWidgetProps) => {

    const TABS_PER_PAGE = 4

    const modalClass = props.visible ? "modal is-active" : "modal"
    const [widget, setWidget] = useState("View")
    const [tabPage, setTabPage] = useState(0)

    const registry = useWidgets()

    const selectedWidget = registry.registered.find(
        x => x.type.toLowerCase() === widget.toLowerCase()
    )

    let wjsx = selectedWidget?.widget

    /**
     * Get the class for the modal 
     */
    const getClass = (w: string): string => {
        return widget === w ? "is-active strong" : ""
    }

    /**
     * Save the configuration
     */
    const saveAction = () => {
        selectedWidget?.save(props)
    }

    /**
     * Get the other tabs. If we're the top view, we don't show the
     * plot, tephigram or dashboard tabs, as the root view can't
     * contain those, and must be a view.
     * 
     * @returns the other tabs if we're not the top view
     */
    const Tabs = () => {
        if (props.top) return (
            <ul>
                <li className={getClass("View")}>
                    <a onClick={() => setWidget("View")}>View</a>
                </li>
            </ul>
        )

        const paginatedRegistry = registry.registered.slice(
            tabPage * TABS_PER_PAGE, (tabPage + 1) * TABS_PER_PAGE
        )

        const MoreTab = () => {
            const pageLimit = (TABS_PER_PAGE * (tabPage+1))

            if (registry.registered.length <= pageLimit) return null
            return (
                <li>
                    <a onClick={() => setTabPage(x=>x+1)}>More &gt;&gt;</a>
                </li>
            )
        }

        const BackTab = () => {
            if (tabPage === 0) return null
            return (
                <li>
                    <a onClick={() => setTabPage(x=>x-1)}>&lt;&lt;Back</a>
                </li>
            )
        }

        return (
            <ul>
                <BackTab />
                {paginatedRegistry.map((x, i) => {
                    return (
                        <li key={i} className={getClass(x.type)}>
                            <a onClick={() => setWidget(x.type)}>{x.name}</a>
                        </li>
                    )})
                }
                <MoreTab />
            </ul>
        )
    }

    // Build the JSX
    return (
        <div className={modalClass}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Configure view area</p>
                    <button className="delete" onClick={props.hide} aria-label="close" />
                </header>
                <section className="modal-card-body">
                    <div className="tabs is-centered">
                        <Tabs />
                    </div>
                    {wjsx}
                </section>
                <footer className="modal-card-foot">

                    <Button.Success onClick={saveAction}>Add</Button.Success>
                    <Button onClick={props.hide}>Cancel</Button>

                </footer>
            </div>
        </div>
    )
}


const emptyConfig = (): AdvancedConfig => {
    return {
        type: "view",
        rows: 1,
        columns: 1,
        rowPercent: [100],
        columnPercent: [100],
        elements: []
    }
}

interface AdvancedViewConfigProps {
    config: AdvancedConfig,
    setConfig: (cfg: AdvancedConfig) => void,
    data?: any,
    top?: boolean
}
const _AdvancedViewConfig = (props: AdvancedViewConfigProps) => {

    const [showWidget, setShowWidget] = useState(false)
    const [darkMode, _setDarkMode] = useDarkMode()
    const registry = useWidgets()

    const setConfig = (cfg: AdvancedConfig, i: number) => {
        let newConfig = { ...props.config }
        newConfig.elements[i] = cfg
        props.setConfig(newConfig)
    }

    const split = (rows: number, columns: number, rowPc: number[], colPc: number[]) => {
        const title = {
            title: props.top ? props?.config?.title : undefined
        }
        props.setConfig({
            type: "view",
            rows: rows,
            columns: columns,
            rowPercent: rowPc,
            columnPercent: colPc,
            elements: new Array(rows * columns).fill(emptyConfig()),
            ...title
        })

    }

    const borderStyle = props.top
        ? darkMode
            ? "3px solid lightgray"
            : "3px solid black"
        : "1px solid gray"

    const style: React.CSSProperties = {
        display: "grid",
        gridTemplateRows: props.config?.rowPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        gridTemplateColumns: props.config?.columnPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        width: props.top ? "100%" : "",
        height: props.top ? 2 * innerHeight / 3 : "",
        outline: borderStyle,
        borderRadius: props.top ? "5px" : undefined,
    }

    const widget = <ConfigWidget
        visible={showWidget}
        split={split}
        hide={() => setShowWidget(false)}
        top={props.top || false}
        setData={props.setConfig} />

    const resetToView = () => {
        props.setConfig(emptyConfig())
    }

    const elements = props.config.elements

    const dmFilter = darkMode ? "invert(63%) sepia(2%) saturate(13%) hue-rotate(331deg) brightness(86%) contrast(79%)" : ""
    const ImageElement = (props: { src: string }) => {
        return (
            <div style={{ outline: borderStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img onClick={resetToView} src={props.src} alt="plot" style={{ height: "64px", width: "64px", filter: dmFilter }} />
            </div>
        )
    }

    if (!elements?.length) {

        if (props.config.type === "view") {
            return (
                <>
                    {widget}
                    <div style={style}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button.Info onClick={() => {
                                setShowWidget(true)
                            }} >Configure</Button.Info>
                        </div>
                    </div>
                </>
            )
        }

        const selectedWidget = registry.registered.find(
            x => x.type.toLowerCase() === props.config.type.toLowerCase()
        )

        return <ImageElement src={selectedWidget?.icon || ""} /> //TODO fix this

    }


    return (
        <div style={style}>
            {elements.map((x: AdvancedConfig, i: number) => {
                return <_AdvancedViewConfig key={i} config={x} setConfig={(cfg: AdvancedConfig) => setConfig(cfg, i)} />
            })}
        </div>
    )

}


const AdvancedViewConfig = () => {
    const currentConfig = useSelector(state => state.view.advancedConfig)
    const dispatch = useDispatch()
    // const [viewTitle, setViewTitle] = useState("")

    /**
     * Function to make the config mutable, so we can edit it - the state
     * returned by useSelector is immutable
     * 
     * @param {AdvancedConfig} cfg - the config to make mutable
     */
    const mutable = (cfg: AdvancedConfig) => {
        let newConfig = { ...cfg }
        newConfig.elements = newConfig.elements.map(x => {
            if (x.type === "view") {
                return mutable(x)
            }
            return x
        })
        return newConfig
    }

    // Create a mutable copy of the config
    const config = mutable(currentConfig)

    // Launch the view in a new tab
    const launch = () => {
        localStorage.setItem("viewConfig", JSON.stringify(currentConfig))
        window.open("jsonview", "_blank")
    }

    return (
        <>
            <FieldInput placeholder="View Title" value={config.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { dispatch(setAdvancedConfig({ ...config, title: e.target.value })) }} />

            <_AdvancedViewConfig config={config} setConfig={(c: AdvancedConfig) => dispatch(setAdvancedConfig(c))} top={true} />
            <div className="is-flex is-justify-content-space-between mt-2">
                <div>
                    {/* <Button.Success onClick={() => { }}>Save</Button.Success> */}
                    <Button.Danger onClick={() => {
                        dispatch(setAdvancedConfig({ ...emptyConfig(), title: "" }))
                    }}>Reset</Button.Danger>
                </div>
                <div>
                    <Button.Info onClick={launch}>Launch</Button.Info>
                </div>
            </div>
        </>
    )

}

export { AdvancedViewConfig }