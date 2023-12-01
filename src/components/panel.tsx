interface PanelProps {
    title: string
    children: JSX.Element | JSX.Element[]
}

type PanelType = "dark" 

const Panel = (props: PanelProps & {type?: PanelType}) => {
    const type = props.type || "dark"

    return (
        <nav className={`panel mt-4 is-${type}`}>
            <p className="panel-heading">
                {props.title}
            </p>
            <div className="p-4">
                {props.children}
            </div>
        </nav>
    )
}

const DarkPanel = (props: PanelProps) => {
    return (
        <Panel {...props} type="dark" />
    )
}



Panel.Dark = DarkPanel

export { Panel }