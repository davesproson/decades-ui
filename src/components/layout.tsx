interface FlexCenterProps {
    children: React.ReactNode,
    extraStyle?: React.CSSProperties,
    direction?: "row" | "column"
}

const FlexCenter = (props: FlexCenterProps) => {
    const direction = props.direction || "row"
    return (
        <div style={{
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            flexDirection: direction,
            ...props.extraStyle
        }}
        >
            {props.children}
        </div>
    )
}

const Section = (props: { children: React.ReactNode }) => {
    return (
        <section className="section">
            {props.children}
        </section>
    )
}

const Spacer = (props: { size: number }) => {
    return <div style={{height: props.size}} />
}

export { FlexCenter, Section, Spacer }