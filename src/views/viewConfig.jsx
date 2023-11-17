
import { useSelector, useDispatch } from 'react-redux'
import {
    addColumn, addRow, removeColumn, removeRow, setPlot, reset, saveView, setConfig,
    setViewConfigTab
} from '../redux/viewSlice'
import { usePlotUrl, getUrl } from '../plot/hooks'
import { useRef, useState } from 'react';
import { useViewUrl } from './hooks';

import { AdvancedViewConfig } from './advancedViewConfig';
import { JsonViewConfig } from './jsonViewConfg';
import { Modal } from '../components/modal';
import { Control, GroupedField, Field, Label, Input } from '../components/forms';
import { Button } from '../components/buttons';

const ViewConfigButtons = () => {
    const dispatch = useDispatch()
    const viewState = useSelector(s => s.view)
    const viewUrl = useViewUrl()
    const ref = useRef(null)
    const [saveModalActive, setSaveModalActive] = useState(false)

    const download = () => {
        const json = {
            config: {
                nRows: viewState.nRows,
                nCols: viewState.nCols,
            },
            plots: [...viewState.plots],
            version: 2
        }

        const element = document.createElement("a");
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(json)));
        element.setAttribute('download', "view-config.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    const showFileSelect = () => {
        ref.current.click()
    }

    const parseV2 = (json) => {
        const nRows = json.config.nRows
        const nCols = json.config.nCols
        const plots = json.plots
        dispatch(setConfig({ nRows, nCols, plots }))
    }

    const parseV1 = (json) => {

        const nRows = json.config.nx
        const nCols = json.config.ny
        const plots = []
        for (const plot of json.plots) {
            const options = {
                timeframe: plot.timeframe,
                params: [...[plot.params]],
                ordinateAxis: plot.ordvar === 'javascript_time' ? 'utc_time' : plot.ordvar,
                plotStyle: plot.style,
                swapOrientation: plot.swapxy,
                scrollingWindow: plot.scrolling,
                server: plot.server,
                dataHeader: plot.data_header,
                axes: [...[plot.axis]]
            }
            plots.push(getUrl(options))
        }
        dispatch(setConfig({ nRows, nCols, plots }))

    }

    const importView = (e) => {
        const parseMap = {
            1: parseV1,
            2: parseV2
        }
        const selectedFile = e.target.files[0]
        if (!selectedFile) {
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target.result
                const json = JSON.parse(text)
                const version = json.version || 1
                parseMap[version](json)
            } catch (e) {
                alert("Error parsing file - please check it is a valid view config file")
                console.log(e)
            }
        }
        reader.readAsText(selectedFile)
        ref.current.value = ""
    }

    const plotEnabled = (() => {
        let enabled = true
        for (let plot of viewState.plots) {
            if (!plot) {
                enabled = false
            }
        }
        return enabled
    })()

    const plotButton = plotEnabled
        ? <Button.Primary fullWidth to={viewUrl} target="_blank">Plot</Button.Primary>
        : <Button.Primary fullWidth disabled>Plot</Button.Primary>

    return (
        <>
            <Field grouped expanded>
                {plotButton}
            </Field>
            <Field grouped expanded>
                <Control expanded>
                    <Button.Primary fullWidth outlined onClick={() => setSaveModalActive(true)}>
                        Save
                    </Button.Primary>
                </Control>
                <Control expanded>
                    <Button.Primary fullWidth outlined onClick={showFileSelect}>
                        Import <input ref={ref} type="file" style={{ display: "none" }} onChange={importView} />
                    </Button.Primary>
                </Control>
                <Control expanded>
                    <Button.Primary fullWidth outlined onClick={download} disabled={!plotEnabled}>
                        Export
                    </Button.Primary>
                </Control>
                <Control expanded>
                    <Button.Danger fullWidth outlined onClick={() => dispatch(reset())}>
                        Reset
                    </Button.Danger>
                </Control>
            </Field>
            <SaveModal active={saveModalActive} close={() => setSaveModalActive(false)} />
        </>
    )
}

/**
 * Renders an input block for a simple plot configuration in the basic view config
 * 
 * @param {Object} props
 * @param {number} props.n - The index of the plot
 * 
 * @returns {JSX.Element}
 */
const PlotInputBlock = (props) => {
    const dispatch = useDispatch()
    const url = useSelector(s => s.view.plots)
    const plotUrl = usePlotUrl()
    const params = useSelector(s => s.vars.params)

    // Check if any params are selected
    const paramsSelected = params.filter(x => x.selected).length > 0

    // Callback for when the input changes
    const onChange = (e) => {
        dispatch(setPlot({ index: props.n, url: e.target.value }))
    }

    // Callback for when the "Use current config" button is clicked
    const onUseCurrentConfig = (e) => {
        dispatch(setPlot({ index: props.n, url: plotUrl }))
    }

    // Render
    return (
        <div className="panel-block">
            <div className="field is-grouped is-flex-grow-1">
                <Control expanded>
                    <Input type="text" value={url[props.n]}
                        onChange={onChange} placeholder="Plot URL..." />
                </Control>
                <Control>
                    <Button.Dark onClick={onUseCurrentConfig} disabled={!paramsSelected}>
                        Use current config
                    </Button.Dark>
                </Control>
            </div>
        </div>
    )
}

/**
 * Renders a panel for selecting plot configurations.
 * 
 * @returns {React.Component} - React component
 */
const BasicViewConfigPlotSelector = () => {
    const plots = useSelector(s => s.view.plots)

    return (
        <div className="panel is-dark mt-2">
            <p className="panel-heading">
                Plot Configurations
            </p>
            {plots.map((url, i) => <PlotInputBlock key={i} n={i} url={url} />)}
        </div>

    )
}

/**
 * Renders a modal for saving the current view configuration.
 * 
 * @param {Object} props - React props
 * @param {boolean} props.active - Whether the modal is active
 * @param {function} props.close - Function to close the modal
 * 
 * @returns {React.Component} - React component
 */
const SaveModal = (props) => {
    const dispatch = useDispatch()
    const viewState = useSelector(s => s.view)
    const [viewName, setViewName] = useState("")

    const active = props.active;
    const close = props.close

    /**
     * Saves the current view configuration to the store.
     */
    const save = () => {
        const savedView = {
            plots: [...viewState.plots],
            nRows: viewState.nRows,
            nCols: viewState.nCols,
            name: viewName,
            id: crypto.randomUUID()
        }
        dispatch(saveView(savedView))
        setViewName("")
        close()
    }

    /**
     * Updates the view name state.
     * 
     * @param {Object} e - Event object
     * @param {string} e.target.value - The new view name
     */
    const onViewNameChange = (e) => {
        setViewName(e.target.value)
    }

    /**
     * Checks if the enter key was pressed and saves the view if it was.
     * 
     * @param {Object} e - Event object
     * @param {string} e.key - The key that was pressed
     */
    const checkKey = (e) => {
        if (e.key === "Enter") {
            save()
        }
    }

    // Render the modal
    return (
        <Modal active={active} close={close}>
            <Modal.Content>
                <div className="box">
                    <p className="is-size-5 mb-2">Save Current View</p>
                    <Input type="text" value={viewName} onKeyDown={checkKey} onChange={onViewNameChange} placeholder="View Name" />
                    <p className="mt-2"></p>
                    <Field grouped>
                        <Control expanded>
                            <Button.Primary fullWidth onClick={save}>Save</Button.Primary>
                        </Control>
                        <Control expanded>
                            <Button.Secondary fullWidth onClick={close}>Cancel</Button.Secondary>
                        </Control>
                    </Field>
                </div>
            </Modal.Content>
        </Modal>
    )
}

/**
 * A component that allows the user to select the number of rows or columns
 * in the basic view configuration panel.
 * 
 * @param {Object} props
 * @param {string} props.dim The dimension to select (either "rows" or "columns")
 * @param {function} props.selector A selector function that returns the current value of the dimension
 * @param {function[]} props.reducers An array of two reducer functions that increase and decrease the dimension
 * 
 * @returns {JSX.Element}
 */
const BasicViewConfigNumSelector = (props) => {

    // Get the current value of the dimension from the store
    const value = useSelector(props.selector)
    const dispatch = useDispatch()

    // Get the reducer functions from the props for increasing and decreasing the dimension
    // and create functions that dispatch them
    const add = () => dispatch(props.reducers[0]())
    const remove = () => dispatch(props.reducers[1]())

    // Return the component
    return (
        <div className="column">
            <GroupedField>
                <Control>
                    <Label>{props.dim}:</Label>
                </Control>
                <Control>
                    <Label>{value}</Label>
                </Control>
                <Field addons={true}>
                    <Control>
                        <Button.Primary outlined onClick={add}>+</Button.Primary>
                    </Control>
                    <Control>
                        <Button.Primary outlined onClick={remove}>-</Button.Primary>
                    </Control>
                </Field>
            </GroupedField>
        </div>
    )
}

/**
 * Returns a basic view configuration panel. This is simply a panel with
 * two number selectors for the number of rows and columns in the view,
 * into which the url of a plot can be entered.
 * 
 * @returns {JSX.Element} The basic view configuration panel.
 */
const BasicViewConfig = () => {

    return (
        <>
            <div className="panel is-dark mt-2">
                <p className="panel-heading">
                    View Configuration
                </p>

                <div className="panel-block">
                    <div className="columns">
                        <BasicViewConfigNumSelector dim="Rows" selector={s => s.view.nRows}
                            reducers={[addRow, removeRow]} />

                        <BasicViewConfigNumSelector dim="Columns" selector={s => s.view.nCols}
                            reducers={[addColumn, removeColumn]} />
                    </div>
                </div>
            </div>
            <BasicViewConfigPlotSelector />
            <ViewConfigButtons />
        </>

    )
}

/**
 * Return the view configuration panel. This allows the user to configure
 * a view using a 'basic', 'advanced' or 'json' interface.
 * 
 * @returns {JSX.Element} The view configuration panel.
 */
const ViewConfig = () => {
    const uiType = useSelector(state => state.view.viewConfigTab)
    const dispatch = useDispatch()

    /**
     * Set the type of the view configuration panel. This is dispatched
     * to the store and used to determine which view configuration panel
     * is displayed.
     * 
     * @param {string} type The type of the view configuration panel,
     *                     either 'BASIC', 'ADVANCED' or 'JSON'.
     */
    const setUiType = (type) => {
        dispatch(setViewConfigTab(type))
    }

    /**
     * Get the class of the tab with the given type. This is used to
     * determine which tab is active.
     * 
     * @param {string} type The type of the tab.
     * @returns {string} The class of the tab.
     */
    const getClass = (type) => {
        return type === uiType ? "is-active" : ""
    }

    /**
     * Get the view configuration panel with the given type.
     * 
     * @param {string} type The type of the view configuration panel.
     * @returns {JSX.Element} The view configuration panel.
     */
    const getUi = (type) => {
        switch (type) {
            case "BASIC":
                return <BasicViewConfig />
            case "ADVANCED":
                return <AdvancedViewConfig />
            case "JSON":
                return <JsonViewConfig />
        }
    }

    // Return the view configuration panel.
    return (
        <div className="container has-navbar-fixed-top">
            <div className="tabs is-centered">
                <ul>
                    <li className={getClass("BASIC")}><a onClick={() => setUiType("BASIC")}>Basic</a></li>
                    <li className={getClass("ADVANCED")}><a onClick={() => setUiType("ADVANCED")}>Advanced</a></li>
                    <li className={getClass("JSON")}><a onClick={() => setUiType("JSON")}>JSON</a></li>
                </ul>
            </div>
            {getUi(uiType)}
        </div>
    )
}


export default ViewConfig