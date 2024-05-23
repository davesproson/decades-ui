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
    return <div style={{ height: props.size }} />
}

const Splash = (props: { children: React.ReactNode }) => {
    return (
        <FlexCenter direction="column" extraStyle={{top: "0px", left: "0px", right: "0px", bottom: "0px", position: "absolute"}}>
            {props.children}
        </FlexCenter>
    )
}

export { FlexCenter, Section, Spacer, Splash }