/**
 * This module provides components for configuring the advanced view.
 */

import React, { useId } from 'react'
import { useState } from 'react';
import { useSelector, useDispatch } from '@/redux/store';
import { saveView, setAdvancedConfig } from '@/redux/viewSlice';
import { Button } from '@/components/ui/button';
import { AdvancedConfig } from '@/redux/viewSlice';

import { useWidgets } from "./widgets/register"
import { useDarkMode } from '@/components/theme-provider';
import { Input } from '@/components/ui/input';
import Navbar from '@/navbar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DecadesBreadCrumb } from '@/components/ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { JsonEditor } from 'json-edit-react'
import { ParameterDispatcher } from '@/parameters/parameter-dispatcher';
import { base } from '@/settings';
import { Download, Upload } from 'lucide-react';
import { v4 } from 'uuid';
import { version3View } from './schema';
import { useToast } from '@/components/ui/use-toast';

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

    const [widget, setWidget] = useState("View")
    const [tabPage, setTabPage] = useState(0)

    const registry = useWidgets()

    // Get the selected widget from the registry
    const selectedWidget = registry.getWidget(widget)

    /**
     * Get the class for the modal 
     */
    // const getClass = (w: string): string => {
    //     return widget === w ? "is-active strong" : ""
    // }

    /**
     * Save the configuration
     */
    const saveAction = () => {
        selectedWidget.save(props) && props.hide()
    }
    saveAction

    /**
     * Get the other tabs. If we're the top view, we don't show the
     * plot, tephigram or dashboard tabs, as the root view can't
     * contain those, and must be a view.
     * 
     * @returns the other tabs if we're not the top view
     */
    const WidgetTabs = () => {

        // If we're the top view, we only show the view tab as a
        // view has to be the root element
        if (props.top) return (
            <div className="flex justify-center items-center">
                <Button size="sm" variant="ghost" onClick={() => setWidget("View")}>View</Button>
            </div>
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
                <Button size="sm" variant="ghost"
                    onClick={() => setTabPage(x => x + 1)}>
                    &gt;&gt;
                </Button>
            )
        }

        // The back tab, which allows us to go to the previous page
        // of tabs if there are more to show
        const BackTab = () => {
            if (tabPage === 0) return null
            return (
                <Button size="sm" variant="ghost" onClick={() => setTabPage(x => x - 1)}>
                    &lt;&lt;
                </Button>
            )
        }

        // Return the tabs
        return (
            <div className="flex justify-center items-center">
                <BackTab />
                {paginatedRegistry.map((view, i) => {
                    return (
                        <Tooltip disableHoverableContent defaultOpen={false} key={i}>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" onClick={() => setWidget(view.type)}>
                                    {view.name}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent hideWhenDetached>
                                <p>{view.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    )
                })
                }
                <MoreTab />
            </div>
        )
    }

    // Build the JSX - TODO extract the modal to a component
    return (
        <Dialog open={props.visible}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Configure view area</DialogTitle>
                </DialogHeader>
                <WidgetTabs />
                {selectedWidget.configComponent}
                <DialogFooter>
                    <Button variant="outline" onClick={props.hide}>Cancel</Button>
                    <Button onClick={saveAction}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const JsonViewConfig = () => {
    const config = useSelector(state => state.view.advancedConfig)
    const dispatch = useDispatch()
    const darkMode = useDarkMode()

    return (
        <JsonEditor
            className="bg-background"
            data={config}
            setData={(data) => {
                dispatch(setAdvancedConfig(data as AdvancedConfig))
                console.log(data)
            }}
            rootName='View Configuration'
            rootFontSize={14}
            theme={darkMode ? ['githubDark', {
                styles: {
                    container: {
                        backgroundColor: "hsv(20, 14.3%, 4.1%)",
                    }
                }
            }] : 'githubLight'}
            minWidth={"100%"}
            showCollectionCount={false}
            showArrayIndices={false}
        />
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
            <div className="flex justify-center items-center">
                <Button variant="outline" onClick={props.showWidget}>
                    Configure
                </Button>
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
    const darkMode = useDarkMode()
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
            ? "2px solid gray"
            : "2px solid gray"
        : "1px solid gray"

    // Define the style for the view
    const style: React.CSSProperties = {
        display: "grid",
        gridTemplateRows: props.config?.rowPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        gridTemplateColumns: props.config?.columnPercent?.map(x => `${x}%`)?.join(" ") || "100%",
        width: props.top ? "100%" : "",
        height: props.top ? 2 * innerHeight / 3 : "",
        outline: borderStyle,
        borderRadius: props.top ? "2px" : undefined,
    }

    // Get the elements for the view
    const elements = props.config.elements

    /**
     * Display an icon for the widget. TODO - this could be factored out
     * @param props
     * @param props.src - the image source
     * 
     * @returns A react component
     */
    const ImageElement = (props: { src: string }) => {
        return (
            <div className="flex justify-center items-center" style={{ outline: borderStyle }}>
                <img className="dm-filter" onClick={resetToView} src={props.src} alt="component" style={{ height: "64px", width: "64px" }} />
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
    const ulID = useId()
    const dispatch = useDispatch()
    const toast = useToast()

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
    const config = (() => {
        try {
            return mutable(currentConfig)
        } catch (e) {
            dispatch(setAdvancedConfig(emptyConfig()))
            return emptyConfig()
        }
    })()

    // Launch the view in a new tab
    const launch = () => {
        localStorage.setItem("viewConfig", JSON.stringify(currentConfig))
        const url = new URL(window.location.href)
        url.pathname = base + "view"
        window.open(url, "_blank")
    }

    const downloadConfigJson = () => {
        const blob = new Blob([JSON.stringify({ ...config, "version": 3 })], { type: "text/json" });
        const link = document.createElement("a");

        link.download = 'view-config.json';
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

        const evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(evt);
        link.remove()
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        const files = e.target.files;
        if (!files || files.length === 0) return;

        fileReader.readAsText(files[0], "UTF-8");
        fileReader.onload = e => {
            try {
                const config = JSON.parse(e?.target?.result?.toString() || "")
                if (!config.name) {
                    config.name = config.title || "Imported View @ " + new Date().toLocaleString()
                }
                if (config.version !== 3) {
                    toast.toast({
                        title: "Invalid config file",
                        description: "The config file must be version 3",
                        variant: "destructive"
                    })
                    return
                }
                const parsedConfig = version3View.safeParse(config)
                if (parsedConfig.success === false) {
                    console.error("Error parsing config file", parsedConfig.error)
                    toast.toast({
                        title: "Error parsing config file",
                        description: "The config file is invalid",
                        variant: "destructive"
                    })
                    return
                }

                dispatch(setAdvancedConfig(config))
                dispatch(saveView({ ...config, id: config.id || v4() }))
            } catch (e) {
                console.error("Error parsing config file", e)
            }
        };
    };

    return (
        <TooltipProvider delayDuration={0} >

            <Input
                className="mb-3"
                placeholder="View Title"
                value={config.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setAdvancedConfig({ ...config, title: e.target.value }))
                }} />

            <_AdvancedViewConfig
                config={config}
                setConfig={(c: AdvancedConfig) => dispatch(setAdvancedConfig(c))}
                top={true} />

            <div className="flex justify-between mt-2">
                <div className="flex gap-2">
                    <Button onClick={downloadConfigJson}><Download /></Button>
                    <Button onClick={() => {
                        const input = document.getElementById(ulID) as HTMLInputElement
                        input.click()
                    }}><Upload /></Button>
                    <input id={ulID} className="hidden" type="file" accept="application/json" onChange={handleFileUpload} />
                </div>
                <div className="flex flex-row-reverse">
                    <Button className="w-[150px]" onClick={launch}>Launch</Button>
                    <Button className="mr-2" variant="outline" onClick={() => {
                        dispatch(setAdvancedConfig({ ...emptyConfig(), title: "" }))
                    }}>Reset</Button>
                </div>
            </div>
        </TooltipProvider>
    )
}

const TabbedViewConfig = () => {
    return (
        <Navbar >
            <ParameterDispatcher>
                <DecadesBreadCrumb
                    crumbs={[
                        { label: "View Configuration" }
                    ]}
                />
                <Tabs defaultValue='visual' className="">
                    <div className="w-full flex justify-center">
                        <TabsList >
                            <TabsTrigger value="visual">Visual</TabsTrigger>
                            <TabsTrigger value="json">JSON</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="visual">
                        <AdvancedViewConfig />
                    </TabsContent>
                    <TabsContent value="json">
                        <JsonViewConfig />
                    </TabsContent>
                </Tabs>
            </ParameterDispatcher>
        </Navbar>
    )
}

export { TabbedViewConfig, AdvancedViewConfig }