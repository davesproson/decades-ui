import { Button } from "../components/buttons"
import type { DecadesMapActions } from "./types"
import type { DecadesMapState } from "./types"

type ToolbarState = Pick<DecadesMapState, "showHeaderBar" | "showLayersMenu" | "showToolbox" | "showGraticule" | "pinAircraft">
type ToolbarActions = Pick<DecadesMapActions, "setShowHeaderBar" | "setShowLayersMenu" | "setShowToolbox" | "setShowGraticule" | "setPinAircraft">

const IconLayers = () => {
    return (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        // {...props}
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
  }
  
const IconViewGrid = () => {
    return (
      <svg fill="none" viewBox="0 0 15 15" height="1em" width="1em">
        <path
          stroke="currentColor"
          d="M0 5.5h15m-15-4h15m-15 8h15m-15 4h15M9.5 0v15m4-15v15m-8-15v15m-4-15v15"
        />
      </svg>
    );
  }

const IconPinFill = () => {
    return (
      <svg
        fill="currentColor"
        viewBox="0 0 16 16"
        height="1em"
        width="1em"
      >
        <path d="M4.146.146A.5.5 0 014.5 0h7a.5.5 0 01.5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 01-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 01-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 015 6.708V2.277a2.77 2.77 0 01-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 01.146-.354z" />
      </svg>
    );
  }

  const IconPageLayoutHeader = () => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="1em"
        width="1em"
      >
        <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2m0 2v4h12V4H6z" />
      </svg>
    );
  }

const IconTools = () => {
    return (
      <svg
        fill="currentColor"
        viewBox="0 0 16 16"
        height="1em"
        width="1em"
      >
        <path d="M1 0L0 1l2.2 3.081a1 1 0 00.815.419h.07a1 1 0 01.708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 000 13a3 3 0 105.878-.851l2.654-2.617.968.968-.305.914a1 1 0 00.242 1.023l3.27 3.27a.997.997 0 001.414 0l1.586-1.586a.997.997 0 000-1.414l-3.27-3.27a1 1 0 00-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0016 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 00-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 01-.293-.707v-.071a1 1 0 00-.419-.814L1 0zm9.646 10.646a.5.5 0 01.708 0l2.914 2.915a.5.5 0 01-.707.707l-2.915-2.914a.5.5 0 010-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z" />
      </svg>
    );
  }


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

    const layerButtonKind = props.state.showLayersMenu ? "success" : "light"
    const headerButtonKind = props.state.showHeaderBar ? "success" : "light"
    const graticuleButtonKind = props.state.showGraticule ? "success" : "light"
    const toolboxButtonKind = props.state.showToolbox ? "success" : "light"
    const pinAircraftButtonKind = props.state.pinAircraft ? "success" : "light"

    return (
        <div style={style}>
            <div>
                <Button kind={layerButtonKind} small style={buttonStyle} onClick={() => props.actions.setShowLayersMenu((x: boolean) => !x)}><IconLayers /></Button>
                <Button kind={headerButtonKind} small style={buttonStyle} onClick={() => props.actions.setShowHeaderBar((x: boolean) => !x)}><IconPageLayoutHeader /></Button>
                <Button kind={graticuleButtonKind} small style={buttonStyle} onClick={() => props.actions.setShowGraticule((x: boolean) => !x)}><IconViewGrid /></Button>
                <Button kind={pinAircraftButtonKind} small style={buttonStyle} onClick={() => props.actions.setPinAircraft((x: boolean) => !x)}><IconPinFill /></Button>
            </div>
            <div>
                <Button kind={toolboxButtonKind} small style={buttonStyle} onClick={() => props.actions.setShowToolbox((x: boolean) => !x)}><IconTools /></Button>
            </div>
        </div>
    )
}

export { Toolbar }