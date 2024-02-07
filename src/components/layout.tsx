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

const Section = (props: { children: React.ReactNode }) => {
    return (
        <section className="section">
            {props.children}
        </section>
    )
}

export { FlexCenter, Section }