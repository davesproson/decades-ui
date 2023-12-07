/**
 * This module provides components for configuring the advanced view.
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

    // Get the selected widget from the registry
    const selectedWidget = registry.getWidget(widget)

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
        selectedWidget.save(props)
    }

    /**
     * Get the other tabs. If we're the top view, we don't show the
     * plot, tephigram or dashboard tabs, as the root view can't
     * contain those, and must be a view.
     * 
     * @returns the other tabs if we're not the top view
     */
    const Tabs = () => {

        // If we're the top view, we only show the view tab as a
        // view has to be the root element
        if (props.top) return (
            <ul>
                <li className={getClass("View")}>
                    <a onClick={() => setWidget("View")}>View</a>
                </li>
            </ul>
        )

        // Otherwise, we show the other tabs, paginated
        const paginatedRegistry = registry.registered.slice(
            tabPage * TABS_PER_PAGE, (tabPage + 1) * TABS_PER_PAGE
        )

        // The more tab, which allows us to go to the next page
        // of tabs if there are more to show
        const MoreTab = () => {
            const pageLimit = (TABS_PER_PAGE * (tabPage + 1))

            if (registry.registered.length <= pageLimit) return null
            return (
                <li>
                    <a onClick={() => setTabPage(x => x + 1)}>More &gt;&gt;</a>
                </li>
            )
        }

        // The back tab, which allows us to go to the previous page
        // of tabs if there are more to show
        const BackTab = () => {
            if (tabPage === 0) return null
            return (
                <li>
                    <a onClick={() => setTabPage(x => x - 1)}>&lt;&lt;Back</a>
                </li>
            )
        }

        // Return the tabs
        return (
            <ul>
                <BackTab />
                {paginatedRegistry.map((view, i) => {
                    return (
                        <li key={i} className={getClass(view.type)}>
                            <a onClick={() => setWidget(view.type)}>{view.name}</a>
                        </li>
                    )
                })
                }
                <MoreTab />
            </ul>
        )
    }

    // Build the JSX - TODO extract the modal to a component
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
                    {selectedWidget.configComponent}
                </section>
                <footer className="modal-card-foot">

                    <Button.Success onClick={saveAction}>Add</Button.Success>
                    <Button onClick={props.hide}>Cancel</Button>

                </footer>
            </div>
        </div>
    )
}

interface ViewContentProps {
    style: React.CSSProperties,
    showWidget: () => void
}
/**
 * The content for an empty view. This is displayed when the view is empty,
 * 
 * @param props 
 * @param props.style - the style for the view
 * @param props.showWidget - a callback to show the configuration widget
 * 
 * @returns - a react component
 */
const ViewContent = (props: ViewContentProps) => {
    return (
        <div style={props.style}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button.Info onClick={props.showWidget}>
                    Configure
                </Button.Info>
            </div>
        </div>
    )
}

// Define an empty config, which is what we get when we create a new view,
// or reset the config
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
/**
 * Stoopid leading underscore to avoid name clash with the component, cos I
 * lack imagination.
 * 
 * This component provides the recursive view configuration.
 * @param props 
 * @param props.config - the configuration
 * @param props.setConfig - a callback to set the configuration
 * @param props.data - the data for the view
 * @param props.top - whether this is the top view
 * 
 * @returns A react component
 */
const _AdvancedViewConfig = (props: AdvancedViewConfigProps) => {

    const [showWidget, setShowWidget] = useState(false)
    const [darkMode, _setDarkMode] = useDarkMode()
    const registry = useWidgets()

    /**
     * Set the configuration for the view at index i
     * @param cfg - the configuration
     * @param i - the index
     */
    const setConfig = (cfg: AdvancedConfig, i: number) => {
        let newConfig = { ...props.config }
        newConfig.elements[i] = cfg
        props.setConfig(newConfig)
    }

    const resetToView = () => {
        props.setConfig(emptyConfig())
    }

    /**
     * Split the view into rows and columns, with the specified percentages by
     * calling setConfig on the parent component
     */
    const split = (rows: number, columns: number, rowPc: number[], colPc: number[]) => {

        // We're only worried about setting the title if we're the top view
        const title = {
            title: props.top ? props?.config?.title : undefined
        }

        // Set the configuration on the parent component
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

    // Set the border style. Thicker for the top view, and dark for dark mode
    // TODO - this should be css
    const borderStyle = props.top
        ? darkMode
            ? "3px solid lightgray"
            : "3px solid black"
        : "1px solid gray"

    // Define the style for the view
    const style: React.CSSProperties = {
        display: "grid",
        gridTemplateRows: props.config?.rowPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        gridTemplateColumns: props.config?.columnPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        width: props.top ? "100%" : "",
        height: props.top ? 2 * innerHeight / 3 : "",
        outline: borderStyle,
        borderRadius: props.top ? "5px" : undefined,
    }

    // Get the elements for the view
    const elements = props.config.elements

    const dmFilter = darkMode ? "invert(63%) sepia(2%) saturate(13%) hue-rotate(331deg) brightness(86%) contrast(79%)" : ""

    /**
     * Display an icon for the widget. TODO - this could be factored out
     * @param props
     * @param props.src - the image source
     * 
     * @returns A react component
     */
    const ImageElement = (props: { src: string }) => {
        return (
            <div style={{ outline: borderStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img onClick={resetToView} src={props.src} alt="component" style={{ height: "64px", width: "64px", filter: dmFilter }} />
            </div>
        )
    }

    // If there are no elements, we're either a view with no children, or
    // a widget. If we're a view, we display the configuration widget, and
    // if we're a widget, we display the widget icon
    if (!elements?.length) {

        if (props.config.type === "view") {
            // We're a view, so display the configuration widget
            return (
                <>
                    <ConfigWidget
                        visible={showWidget}
                        split={split}
                        hide={() => setShowWidget(false)}
                        top={props.top || false}
                        setData={props.setConfig} />
                    <ViewContent style={style} showWidget={() => setShowWidget(true)} />
                </>
            )
        }

        // We're a widget, so display the widget icon
        const selectedWidget = registry.getWidget(props.config.type)
        return <ImageElement src={selectedWidget.icon} />

    }

    // Return ourself, and a copy of ourself for each child element
    return (
        <div style={style}>
            {elements.map((x: AdvancedConfig, i: number) => {
                return <_AdvancedViewConfig key={i} config={x} setConfig={(cfg: AdvancedConfig) => setConfig(cfg, i)} />
            })}
        </div>
    )

}

/**
 * This component provides the advanced view configuration. It's mostly a
 * wrapper around the recursive view configuration component, which provides
 * the top level view, however as the top level view is a special case, we
 * dispatch the configuration to the store rather than passing it back
 * up the tree.
 * 
 * The component also allows a view title to be set, and provides buttons
 * to launch the view in a new tab or reset the configuration.
 * 
 * @returns A react component
 */
const AdvancedViewConfig = () => {
    const currentConfig = useSelector(state => state.view.advancedConfig)
    const dispatch = useDispatch()

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
            <FieldInput 
                placeholder="View Title"
                value={config.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setAdvancedConfig({ ...config, title: e.target.value }))
                     }} />

            <_AdvancedViewConfig 
                config={config}
                setConfig={(c: AdvancedConfig) => dispatch(setAdvancedConfig(c))}
                top={true} />

            <div className="is-flex is-justify-content-space-between mt-2">
                <Button.Danger onClick={() => {
                    dispatch(setAdvancedConfig({ ...emptyConfig(), title: "" }))
                }}>Reset</Button.Danger>
                <Button.Info onClick={launch}>Launch</Button.Info>
            </div>
        </>
    )

}

export { AdvancedViewConfig }