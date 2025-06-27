import { Dispatch, SetStateAction, useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { DataContext } from "./context"
// import { OverlayBox } from "./overlayBox"
import { DecadesMapModality, type DecadesMapActions, type DecadesMapState, DrawModeType } from "./types"
import { Show } from "../components/flow"
import { Input } from "@/components/ui/input"



const ToolBoxSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mt-2">
        <h3>{title}</h3>
        <div className="flex justify-between">
            {children}
        </div>
    </div>
)

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

    const measureFromAircraft = state.mapModes.includes(DecadesMapModality.ADD_AIRCRAFT_MEASURE)
    const lineMeasureActive = state.mapModes.includes(DecadesMapModality.START_MEASUREMENT)
    const deleteFlagActive = state.mapModes.includes(DecadesMapModality.DELETE_FLAG)
    const addFlagActive = state.mapModes.includes(DecadesMapModality.ADD_FLAG)
    const lineDrawActive = state.drawMode === "LineString"
    const circleDrawActive = state.drawMode === "Circle"
    const polygonDrawActive = state.drawMode === "Polygon"


    return (
        <>
            <ToolBoxSection title="Flags">
                <Button size="sm" className="flex-1 mr-1" onClick={addFlag}>Drop</Button>
                <Button size="sm" variant={addFlagActive ? "success" : "default"} className="flex-1 mr-1" onClick={() => actions.toggleMapMode(DecadesMapModality.ADD_FLAG)}>Mouse</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={toggle}>Add</Button>
                <Button size="sm" variant={deleteFlagActive ? "success" : "default"} className="flex-1 mr-1" onClick={() => actions.toggleMapMode(DecadesMapModality.DELETE_FLAG)}>Remove</Button>
                <Button size="sm" variant="destructive" className="flex-1 mr-1" onClick={() => actions.setFlags([])}>Clear</Button>
            </ToolBoxSection>
            <ToolBoxSection title="Measure">
                <Button size="sm" variant={measureFromAircraft ? "success" : "default"} className="flex-1 mr-1" onClick={() => actions.toggleMapMode(DecadesMapModality.ADD_AIRCRAFT_MEASURE)}>From 146</Button>
                <Button size="sm" variant={lineMeasureActive ? "success" : "default"} className="flex-1 mr-1" onClick={() => actions.toggleMapMode(DecadesMapModality.START_MEASUREMENT)}>Line</Button>
                <Button size="sm" variant="destructive" className="flex-1 mr-1" onClick={clearMeasurements}>Clear</Button>
            </ToolBoxSection>
            <ToolBoxSection title="Wind">
                <Button size="sm" variant={state.showWindVane ? "success" : "default"} className="flex-1 mr-1" onClick={() => actions.setShowWindVane(x => !x)}>Vane</Button>
                <Button size="sm" className="flex-1 mr-1" onClick={dropDrifter}>Drop Drifter</Button>
                <Button size="sm" variant="destructive" className="flex-1 mr-1" onClick={() => actions.setDrifters([])}>Clear Drifters</Button>
            </ToolBoxSection>
            <ToolBoxSection title="Draw">
                <Button size="sm" variant={lineDrawActive ? "success" : "default"} className="flex-1 mr-1" onClick={() => setDrawMode("LineString")}>Line</Button>
                <Button size="sm" variant={circleDrawActive ? "success" : "default"} className="flex-1 mr-1" onClick={() => setDrawMode("Circle")}>Circle</Button>
                <Button size="sm" variant={polygonDrawActive ? "success" : "default"} className="flex-1 mr-1" onClick={() => setDrawMode("Polygon")}>Polygon</Button>
                <Button size="sm" variant="destructive" className="flex-1 mr-1" onClick={() => setDrawMode(DecadesMapModality.DELETE_DRAWING)}>Clear</Button>
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
        if (!lastFlag?.name) {
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

    return (
        <div>
            <h3 className="mb-2">Add Flag</h3>
            <div className="mb-2">
                <div className="is-flex">
                    <label style={labelStyle} className="label mr-2">Lat</label>
                    <Input placeholder="Decimal latitude" value={lat} onChange={setLatOrLon(setLat)} />
                </div>
                <div className="is-flex">
                    <label style={labelStyle} className="label mr-2">Lon</label>
                    <Input placeholder="Decimal longitude" value={lon} onChange={setLatOrLon(setLon)} />
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