import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import type { DecadesMapActions } from "./types"
import type { DecadesMapState } from "./types"
import { MapContext } from "./context"

type ToolbarState = Pick<
    DecadesMapState,
    "showHeaderBar" | "showLayersMenu" | "showToolbox" | "showGraticule" | "pinAircraft"
>
type ToolbarActions = Pick<
    DecadesMapActions,
    "setShowHeaderBar" | "setShowLayersMenu" | "setShowToolbox" | "setShowGraticule" | "setPinAircraft"
>

import { Grid, Layers, AppWindow, Pin, Search, ZoomIn, ZoomOut, Wrench } from "lucide-react"


const ZoomControl = ({ size }: { size?: number }) => {
    const { state } = useContext(MapContext)

    const zoom = (delta: number) => {
        if (!state.map) return
        const view = state.map.getView()
        const currentZoom = view.getZoom()
        if (!currentZoom) return
        view.animate({
            zoom: currentZoom + delta,
            duration: 500
        })
    }
    const [zoomActive, setZoomActive] = useState(false)
    const zoomButtonVariant = zoomActive ? "success" : undefined
    const buttonClass = "pointer-events-auto mb-[2px]"

    const ZoomButtons = () => {
        if (!zoomActive) return null
        return (
            <>
                <Button size="sm" className={buttonClass} onClick={() => zoom(-1)}>
                    <ZoomOut size={size} />
                </Button>
                <Button size="sm" className={buttonClass} onClick={() => zoom(1)}>
                    <ZoomIn size={size} />
                </Button>
            </>
        )
    }

    return (
        <div className="absolute inline-flex flex-col-reverse h-auto bottom-0 ">
            <Button size="sm" variant={zoomButtonVariant} className={buttonClass} onClick={() => setZoomActive(x => !x)}>
                <Search size={size} />
            </Button>
            <ZoomButtons />
        </div>
    )
}


type ToolbarProps = {
    state: ToolbarState,
    actions: ToolbarActions
}
const Toolbar = (props: ToolbarProps) => {

    // const style: React.CSSProperties = {
    //     pointerEvents: 'none',
    //     zIndex: 2,
    //     position: 'absolute',
    //     inset: "auto 0 0 0",
    //     height: "50px",
    //     padding: "10px",
    //     display: "flex",
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    // }

    const layerButtonVariant = props.state.showLayersMenu ? "success" : undefined
    const headerButtonVariant = props.state.showHeaderBar ? "success" : undefined
    const graticuleButtonVariant = props.state.showGraticule ? "success" : undefined
    const toolboxButtonVariant = props.state.showToolbox ? "success" : undefined
    const pinAircraftButtonVariant = props.state.pinAircraft ? "success" : undefined

    // const buttonStyle: React.CSSProperties = {
    //     marginRight: "5px",
    //     borderRadius: "5px",
    //     pointerEvents: "auto",
    // }

    const buttonClass = "mr-1 pointer-events-auto"
    const toggle = (x: boolean) => !x

    return (
        <div className="pointer-events-none z-10 absolute top-auto right-0 left-0 bottom-0 h-[50px] p-3 flex flex-row justify-between mb-1">
            <div>
                <Button size="sm" variant={layerButtonVariant} className={buttonClass} onClick={() => props.actions.setShowLayersMenu(toggle)}>
                    <Layers size={15} />
                </Button>
                <Button size="sm" variant={headerButtonVariant} className={buttonClass} onClick={() => props.actions.setShowHeaderBar(toggle)}>
                    <AppWindow size={15} />
                </Button>
                <Button size="sm" variant={graticuleButtonVariant} className={buttonClass} onClick={() => props.actions.setShowGraticule(toggle)}>
                    <Grid size={15} />
                </Button>
                <Button size="sm" variant={pinAircraftButtonVariant} className={buttonClass} onClick={() => props.actions.setPinAircraft(toggle)}>
                    <Pin size={15} />
                </Button>
                <ZoomControl size={15} />
            </div>
            <div>
                <Button size="sm" variant={toolboxButtonVariant} className={buttonClass} onClick={() => props.actions.setShowToolbox(toggle)}>
                    <Wrench size={15} />
                </Button>
            </div>
        </div>
    )
}

export { Toolbar }