type OverlayBoxProps = {
    children: React.ReactNode,
    top?: number | "auto",
    right?: number | "auto",
    bottom?: number | "auto",
    left?: number | "auto",
    width?: number,
    height?: number,
    zIndex?: number,
}


const OverlayBox = (props: OverlayBoxProps) => {
    const style: React.CSSProperties = {
        zIndex: props.zIndex || 2,
        position: 'relative',
        right: props.right,
        bottom: props.bottom,
        left: props.left,
        top: props.top,
        height: props.height,
        width: props.width,
        padding: "10px",
        borderRadius: "10px",
        opacity: .95
    }

    return (
        <div className="bg-background" style={style}>
            {props.children}
        </div>
    );
};


export { OverlayBox }