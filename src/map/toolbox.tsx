import { Dispatch, SetStateAction, useContext, useState } from "react"
import { Button } from "../components/buttons"
import { DataContext } from "./context"
import { OverlayBox } from "./overlayBox"
import { DecadesMapModality, type DecadesMapActions, type DecadesMapState, DrawModeType } from "./types"

const buttonOpts = {
    extraClasses: "is-flex is-flex-grow-1 m-1",
    small: true
}

const ToolBoxSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3>{title}</h3>
        <div className="is-flex">
            {children}
        </div>
    </div>
)

const getKind = (test: (() => boolean) | boolean) => {
    if(typeof test === 'function') {
        return test() ? 'success' : 'info'
    }
    return test ? 'success' : 'info'
}

const DefaultToolboxContent = ({ show, state, actions, toggle }: ToolboxProps & { toggle: () => void }) => {
    const { aircraftData } = useContext(DataContext)
    
    if (!show) {
        return null
    }
    
    const addFlag = () => {
        if (!aircraftData) {
            return
        }
        const lastFlag = state.flags[state.flags.length - 1]
        let numFlags: number
        if (!lastFlag?.name) {
            numFlags = 0
        } else {
            numFlags = parseInt(lastFlag.name.split(' ')[1])
        }
        const newFlag = {
            lat: aircraftData.lat,
            lon: aircraftData.lon,
            name: `Flag ${numFlags + 1}`
        }
        actions.setFlags(x => [...x, newFlag])
    }

    const clearMeasurements = () => {
        actions.setAircraftMeasures([])
        actions.setMeasurements([])
    }

    const setDrawMode = (mode: DrawModeType) => {
        if(state.drawMode === mode) {
            actions.setDrawMode(null)
            return
        }
        actions.setDrawMode(mode)
    }

    const outlineFlagDeleteButton = !state.mapModes.includes(DecadesMapModality.DELETE_FLAG)

    const measureFrom146kind = getKind(
        state.mapModes.includes(DecadesMapModality.ADD_AIRCRAFT_MEASURE)
    )

    const measureKind = getKind(
        state.mapModes.includes(DecadesMapModality.START_MEASUREMENT)
    )

    const dropDrifter = () => {
        if (!aircraftData) {
            return
        }
        const newDrifter = {
            lat: aircraftData.lat,
            lon: aircraftData.lon,
            time: new Date().getTime()
        }
        actions.setDrifters(x => [...x, newDrifter])
    }


    return (
        <>
            <ToolBoxSection title="Flags">
                <Button.Info {...buttonOpts} onClick={addFlag}>Drop</Button.Info>
                <Button.Info {...buttonOpts} onClick={toggle}>Add</Button.Info>
                <Button.Danger {...buttonOpts} outlined={outlineFlagDeleteButton} onClick={() => actions.toggleMapMode(DecadesMapModality.DELETE_FLAG)}>Remove</Button.Danger>
                <Button.Danger {...buttonOpts} onClick={() => actions.setFlags([])}>Clear</Button.Danger>
            </ToolBoxSection>
            <ToolBoxSection title="Measure">
                <Button kind={measureFrom146kind} {...buttonOpts} onClick={() => actions.toggleMapMode(DecadesMapModality.ADD_AIRCRAFT_MEASURE)}>From 146</Button>
                <Button kind={measureKind} {...buttonOpts} onClick={()=>actions.toggleMapMode(DecadesMapModality.START_MEASUREMENT)}>Line</Button>
                <Button.Danger {...buttonOpts} onClick={clearMeasurements}>Clear</Button.Danger>
            </ToolBoxSection>
            <ToolBoxSection title="Wind">
                <Button kind={getKind(state.showWindVane)} {...buttonOpts} onClick={()=>actions.setShowWindVane(x=>!x)}>Vane</Button>
                <Button.Info {...buttonOpts} onClick={dropDrifter}>Drop Drifter</Button.Info>
                <Button.Danger {...buttonOpts} onClick={()=>actions.setDrifters([])}>Clear Drifters</Button.Danger>
            </ToolBoxSection>
            <ToolBoxSection title="Draw">
                <Button kind={getKind(state.drawMode==="LineString")} {...buttonOpts} onClick={()=>setDrawMode("LineString")}>Line</Button>
                <Button kind={getKind(state.drawMode==="Circle")} {...buttonOpts} onClick={()=>setDrawMode("Circle")}>Circle</Button>
                <Button kind={getKind(state.drawMode==="Polygon")} {...buttonOpts} onClick={()=>setDrawMode("Polygon")}>Polygon</Button>
                <Button.Danger {...buttonOpts} onClick={()=>setDrawMode(DecadesMapModality.DELETE_DRAWING)}>Clear</Button.Danger>
            </ToolBoxSection>
        </>
    )
}

const AddFlagContent = ({ toggle, state, actions}: { toggle: () => void, state: DecadesMapState, actions: DecadesMapActions }) => {

    const [lat, setLat] = useState<string>('')
    const [lon, setLon] = useState<string>('')

    const labelStyle: React.CSSProperties = {
        minWidth: 50
    }

    const checkLatOrLon = (str: string) => {
        const num = parseFloat(str)
        if (isNaN(num)) {
            return ''
        }
        return num.toString()
    }

    const addFlag = () => {
        if(!checkLatOrLon(lat) || !checkLatOrLon(lon)) {
            return
        }

        let lastFlag = state.flags[state.flags.length - 1]
        let numFlags: number
        if(!lastFlag.name) {
            numFlags = 0
        } else {
            numFlags = parseInt(lastFlag.name.split(' ')[1])
        }
        const newFlag = {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            name: `Flag ${numFlags + 1}`
        }
        actions.setFlags(x => [...x, newFlag])
        toggle()
    }

    const setLatOrLon = (setter: Dispatch<SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = e.target.value
        setter(num)
    }

    const lonClass = !!checkLatOrLon(lon) ? 'is-success' : 'is-danger'
    const latClass = !!checkLatOrLon(lat) ? 'is-success' : 'is-danger'

    return (
        <div>
            <h3 className="mb-2">Add Flag</h3>
            <div className="mb-2">
                <div className="is-flex">
                    <label style={labelStyle} className="label mr-2">Lat</label>
                    <input className={`is-small input ${latClass}`} placeholder="Decimal latitude" value={lat} onChange={setLatOrLon(setLat)}/>
                </div>
                <div className="is-flex">
                    <label style={labelStyle} className="label mr-2">Lon</label>
                    <input className={`is-small input ${lonClass}`} placeholder="Decimal longitude" value={lon} onChange={setLatOrLon(setLon)}/>
                </div>

            </div>
            <div className="is-flex">
                <Button.Success small extraClasses="m-1 is-flex-grow-1" onClick={addFlag}>Add</Button.Success>
                <Button.Danger small extraClasses="m-1" onClick={toggle}>Cancel</Button.Danger>
            </div>
        </div>
    )

}

const ToolBoxTitle = () => (
    <h2 className="title is-4">Toolbox</h2>
)

type ToolboxProps = {
    show: boolean,
    state: DecadesMapState,
    actions: DecadesMapActions
}
const Toolbox = ({ show, state, actions }: ToolboxProps) => {
    const [showToolbox, setShowToolbox] = useState<boolean>(true)

    const style = {
        right: 10,
        bottom: 50,
        height: 350,
        width: 350,
    }

    const content = showToolbox
        ? <DefaultToolboxContent show={showToolbox} toggle={() => setShowToolbox(x => !x)} state={state} actions={actions} />
        : <AddFlagContent toggle={() => setShowToolbox(x => !x)} state={state} actions={actions}/>

    return (
        <OverlayBox show={show} {...style}>
            <ToolBoxTitle />
            {content}
        </OverlayBox>
    )
}

export { Toolbox }