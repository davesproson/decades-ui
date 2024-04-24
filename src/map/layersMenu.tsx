type LayerMenuProps = {
    show: boolean,
    toggleLayerVisibility: Function,
    layers: Array<any>
}

const LayersMenu = ({show, toggleLayerVisibility, layers}: LayerMenuProps) => {
    const style: React.CSSProperties = {
        top: 120,
        bottom: 50,
        width: 250,
        left: 10,
        borderRadius: "10px",
        zIndex: 1,
        position: "absolute",
        padding: "10px",
    }

    if(!show) return null

    return (
        <div className="has-background-light" style={style}>
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
        </div>
    )
}

export { LayersMenu }