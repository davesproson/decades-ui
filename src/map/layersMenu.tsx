// import { OverlayBox } from "./overlayBox"

type LayerMenuProps = {
    toggleLayerVisibility: Function,
    layers: Array<any>
    headerActive: boolean
}

const LayersMenu = ({ toggleLayerVisibility, layers, headerActive }: LayerMenuProps) => {
    // const style = {
    //     top: headerActive ? 120 : 20,
    //     bottom: 50,
    //     width: 250,
    //     left: 10,
    // }
    headerActive

    return (
        <div className="absolute bg-background p-4 rounded-md bottom-[50px] left-[10px] z-11 top-[150px] min-h-[300px] w-[250px]">
            <h2 className="text-2xl mb-2">Layers</h2>
            <ul>
                {layers.map((layer: any) => (
                    <li key={layer.name}>
                        <label className="checkbox">
                            <input style={{ marginRight: "5px" }} type="checkbox" checked={layer.visible} onChange={() => toggleLayerVisibility(layer.name)} />
                            {layer.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export { LayersMenu }