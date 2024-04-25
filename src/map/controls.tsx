import { Button } from "../components/buttons"

type ToolbarProps = {
    state: {
        showHeader: boolean,
        showLayersMenu: boolean,
        showToolbox: boolean,
    },
    actions: {
        setShowHeader: Function,
        setShowLayersMenu: Function,
        setShowToolbox: Function,
    }
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
                <Button.Light small style={buttonStyle} onClick={() => props.actions.setShowHeader((x: boolean) => !x)}>L</Button.Light>
            </div>
            <div>
                <Button.Light small style={buttonStyle} onClick={() => props.actions.setShowToolbox((x: boolean) => !x)}>L</Button.Light>
            </div>
        </div>
    )
}

export { Toolbar }