import { OverlayBox } from "./overlayBox"

type LayerMenuProps = {
    toggleLayerVisibility: Function,
    layers: Array<any>
    headerActive: boolean
}

const LayersMenu = ({toggleLayerVisibility, layers, headerActive}: LayerMenuProps) => {
    const style = {
        top: headerActive ? 120 : 20,
        bottom: 50,
        width: 250,
        left: 10,
    }

    return (
        <OverlayBox {...style}>
            <h2 className="title is-4">Layers</h2>
            <ul>
                {layers.map((layer: any) => (
                    <li key={layer.name}>
                        <label className="checkbox">
                            <input style={{marginRight: "5px"}} type="checkbox" checked={layer.visible} onChange={()=>toggleLayerVisibility(layer.name)} />
                            {layer.name}
                        </label>
                    </li>
                ))}
            </ul>
        </OverlayBox>
    )
}

export { LayersMenu }