import { Button } from "../components/buttons"
import type { DecadesMapActions } from "./types"
import type { DecadesMapState } from "./types"

type ToolbarState = Pick<DecadesMapState, "showHeaderBar" | "showLayersMenu" | "showToolbox" | "showGraticule">
type ToolbarActions = Pick<DecadesMapActions, "setShowHeaderBar" | "setShowLayersMenu" | "setShowToolbox" | "setShowGraticule">

type ToolbarProps = {
    state: ToolbarState,
    actions: ToolbarActions
}
const Toolbar = (props: ToolbarProps) => {
    const style: React.CSSProperties = {
        pointerEvents: 'none',
        zIndex: 2,
        position: 'absolute',
        inset: "auto 0 0 0",
        height: "50px",
        padding: "10px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    }

    const buttonStyle: React.CSSProperties = {
        marginRight: "5px",
        borderRadius: "5px",
        pointerEvents: "auto",

    }

    return (
        <div style={style}>
            <div>
                <Button.Light small style={buttonStyle} onClick={() => props.actions.setShowLayersMenu((x: boolean) => !x)}>L</Button.Light>
                <Button.Light small style={buttonStyle} onClick={() => props.actions.setShowHeaderBar((x: boolean) => !x)}>H</Button.Light>
                <Button.Light small style={buttonStyle} onClick={() => props.actions.setShowGraticule((x: boolean) => !x)}>G</Button.Light>
                <Button.Light small style={buttonStyle} onClick={() => {}}>P</Button.Light>
            </div>
            <div>
                <Button.Light small style={buttonStyle} onClick={() => props.actions.setShowToolbox((x: boolean) => !x)}>T</Button.Light>
            </div>
        </div>
    )
}

export { Toolbar }