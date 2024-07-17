type FlexCenterProps = {
    children: React.ReactNode,
    direction?: "row" | "col" | "col-reverse" | "row-reverse",
    style?: React.CSSProperties,
}

export const FlexCenter = ({ children, direction, style }: FlexCenterProps) => {
    const flexDirection = `flex-${direction || "row"}`
    return (
        <div className={`flex items-center justify-center h-full w-full ${flexDirection}`} style={style}>
            {children}
        </div>
    )
}

export const Splash = ({ children, direction, style }: FlexCenterProps) => {
    const flexDirection = `flex${direction || "row"}`
    return (
        <div className={`fixed flex inset-0 items-center justify-center h-full w-full ${flexDirection}`} style={style}>
            {children}
        </div>
    )
}
