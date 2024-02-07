

interface ContainerProps {
    children: React.ReactNode
    fixedNav?: boolean
}

const Container = (props: ContainerProps) => {
    const divClass = props.fixedNav ? "container has-navbar-fixed-top" : "container"

    return (
        <div className={divClass}>
            {props.children}
        </div>
    )
}

export { Container }