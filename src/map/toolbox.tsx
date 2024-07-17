import { Dispatch, SetStateAction, useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { DataContext } from "./context"
// import { OverlayBox } from "./overlayBox"
import { DecadesMapModality, type DecadesMapActions, type DecadesMapState, DrawModeType } from "./types"
import { Show } from "../components/flow"
import { Input } from "@/components/ui/input"

// const buttonOpts = {
//     extraClasses: "is-flex is-flex-grow-1 m-1",
//     small: true
// }

const ToolBoxSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mt-2">
        <h3>{title}</h3>
        <div className="flex justify-between">
            {children}
        </div>
    </div>
)

// const getKind = (test: (() => boolean) | boolean) => {
//     if(typeof test === 'function') {
//         return test() ? 'success' : 'info'
//     }
//     return test ? 'success' : 'info'
// }

const DefaultToolboxContent = ({ state, actions, toggle }: ToolboxProps & { toggle: () => void }) => {
    const { aircraftData } = useContext(DataContext)

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
        if (state.drawMode === mode) {
            actions.setDrawMode(null)
            return
        }
        actions.setDrawMode(mode)
    }

    // const outlineFlagDeleteButton = !state.mapModes.includes(DecadesMapModality.DELETE_FLAG)

    // const measureFrom146kind = getKind(
    // state.mapModes.includes(DecadesMapModality.ADD_AIRCRAFT_MEASURE)
    // )

    // const measureKind = getKind(
    // state.mapModes.includes(DecadesMapModality.START_MEASUREMENT)
    // )

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
            {/* <ToolBoxSection title="Flags">
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
            </ToolBoxSection> */}
            <ToolBoxSection title="Flags">
                <Button size="sm" className="flex-1 mr-1" onClick={addFlag}>Drop</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={toggle}>Add</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={() => actions.toggleMapMode(DecadesMapModality.DELETE_FLAG)}>Remove</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={() => actions.setFlags([])}>Clear</Button>
            </ToolBoxSection>
            <ToolBoxSection title="Measure">
                <Button size="sm" className="flex-1 mr-1" onClick={() => actions.toggleMapMode(DecadesMapModality.ADD_AIRCRAFT_MEASURE)}>From 146</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={() => actions.toggleMapMode(DecadesMapModality.START_MEASUREMENT)}>Line</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={clearMeasurements}>Clear</Button>
            </ToolBoxSection>
            <ToolBoxSection title="Wind">
                <Button size="sm" className="flex-1 mr-1" onClick={() => actions.setShowWindVane(x => !x)}>Vane</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={dropDrifter}>Drop Drifter</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={() => actions.setDrifters([])}>Clear Drifters</Button>
            </ToolBoxSection>
            <ToolBoxSection title="Draw">
                <Button size="sm" className="flex-1 mr-1" onClick={() => setDrawMode("LineString")}>Line</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={() => setDrawMode("Circle")}>Circle</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={() => setDrawMode("Polygon")}>Polygon</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={() => setDrawMode(DecadesMapModality.DELETE_DRAWING)}>Clear</Button>
            </ToolBoxSection>
        </>
    )
}

const AddFlagContent = ({ toggle, state, actions }: { toggle: () => void, state: DecadesMapState, actions: DecadesMapActions }) => {

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
        if (!checkLatOrLon(lat) || !checkLatOrLon(lon)) {
            return
        }

        let lastFlag = state.flags[state.flags.length - 1]
        let numFlags: number
        if (!lastFlag.name) {
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
                    <Input className={`is-small input ${latClass}`} placeholder="Decimal latitude" value={lat} onChange={setLatOrLon(setLat)} />
                </div>
                <div className="is-flex">
                    <label style={labelStyle} className="label mr-2">Lon</label>
                    <Input className={`is-small input ${lonClass}`} placeholder="Decimal longitude" value={lon} onChange={setLatOrLon(setLon)} />
                </div>

            </div>
            <div className="is-flex">
                <Button size="sm" variant="success" className="m-1 flex-grow" onClick={addFlag}>Add</Button>
                <Button size="sm" variant="outline" className="m-1" onClick={toggle}>Cancel</Button>
            </div>
        </div>
    )

}

const ToolBoxTitle = () => (
    <h2 className="text-lg">Toolbox</h2>
)

type ToolboxProps = {
    state: DecadesMapState,
    actions: DecadesMapActions
}
const Toolbox = ({ state, actions }: ToolboxProps) => {
    const [showToolbox, setShowToolbox] = useState<boolean>(true)

    return (
        <div className="absolute bg-background p-4 rounded-md bottom-[50px] right-[10px] h-auto w-auto z-10">
            <ToolBoxTitle />
            <Show when={showToolbox}>
                <DefaultToolboxContent toggle={() => setShowToolbox(x => !x)} state={state} actions={actions} />
            </Show>
            <Show when={!showToolbox}>
                <AddFlagContent toggle={() => setShowToolbox(x => !x)} state={state} actions={actions} />
            </Show>
        </div>
    )
}

export { Toolbox }