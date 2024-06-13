

interface ContainerProps {
    children: React.ReactNode
    fixedNav?: boolean,
    tabbedView?: boolean
}

const Container = (props: ContainerProps) => {
    const divClass = "container"
    let top = 0
    if(props.fixedNav) {
        top += 60
    }
    if(props.tabbedView) {
        top += 50
    }

    return (
        <div className={divClass} style={{top}}>
            {props.children}
        </div>
    )
}

export { Container }