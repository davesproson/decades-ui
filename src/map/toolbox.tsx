import { useContext } from "react"
import { Button } from "../components/buttons"
import { DataContext } from "./context"
import { OverlayBox } from "./overlayBox"
import { DecadesMapModality, type DecadesMapActions, type DecadesMapState } from "./types"

const ToolBoxSection = ({title, children}: {title: string, children: React.ReactNode}) => (
    <div>
        <h3>{title}</h3>
        <div className="is-flex">
            {children}
        </div>
    </div>
)

const ToolBoxTitle = () => (
    <h2 className="title is-4">Toolbox</h2>
)

type ToolboxProps = {
    show: boolean,
    state: DecadesMapState,
    actions: DecadesMapActions
}
const Toolbox = ({show, state, actions}: ToolboxProps) => {
    const { aircraftData } = useContext(DataContext)

    const style = {
        right: 10,
        bottom: 50,
        height: 400,
        width: 350,
    }

    const buttonOpts = {
        extraClasses: "is-flex is-flex-grow-1 m-1",
        small: true
    }

    const addFlag = () => { 
        const numFlags = state.flags.length
        const newFlag = {
            lat: aircraftData.lat,
            lon: aircraftData.lon,
            name: `Flag ${numFlags + 1}`
        }
        actions.setFlags(x => [...x, newFlag])
    }

    const outlineFlagDeleteButton = !state.mapModes.includes(DecadesMapModality.DELETE_FLAG)

    return (
        <OverlayBox show={show} {...style}>
            <ToolBoxTitle />
            <ToolBoxSection title="Flags">
                <Button.Info {...buttonOpts} onClick={addFlag}>Drop</Button.Info>
                <Button.Success {...buttonOpts}>Add</Button.Success>
                <Button.Danger {...buttonOpts} outlined={outlineFlagDeleteButton} onClick={()=>actions.toggleMapMode(DecadesMapModality.DELETE_FLAG)}>Remove</Button.Danger>
            </ToolBoxSection>
            <ToolBoxSection title="Measure">
                <Button.Info {...buttonOpts}>From 146</Button.Info>
                <Button.Info {...buttonOpts}>Line</Button.Info>
                <Button.Danger {...buttonOpts}>Clear</Button.Danger>
            </ToolBoxSection>
            <ToolBoxSection title="Wind">
                <Button.Info {...buttonOpts}>Vane</Button.Info>
                <Button.Info {...buttonOpts}>Drop Drifters</Button.Info>
                <Button.Danger {...buttonOpts}>Clear Drifters</Button.Danger>
            </ToolBoxSection>
            <ToolBoxSection title="Draw">
                <Button.Info {...buttonOpts}>Line</Button.Info>
                <Button.Info {...buttonOpts}>Circle</Button.Info>
                <Button.Info {...buttonOpts}>Polygon</Button.Info>
                <Button.Danger {...buttonOpts}>Clear</Button.Danger>
            </ToolBoxSection>
        </OverlayBox>
    )
}

export { Toolbox }