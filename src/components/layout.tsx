interface FlexCenterProps {
    children: React.ReactNode,
    extraStyle?: React.CSSProperties,
}

const FlexCenter = (props: FlexCenterProps) => {
    return (
        <div style={{
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            ...props.extraStyle
        }}
        >
            {props.children}
        </div>
    )
}

export { FlexCenter }