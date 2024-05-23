type CardProps = {
    children: React.ReactNode
    extraStyles?: React.CSSProperties
}

const Card = (props: CardProps) => {
    let extraStyles = props.extraStyles || {}
    return (
        <div className="card" style={{...extraStyles}}>
            {props.children}
        </div>
    )
}

const Header = (props: { title: string }) => {
    return (
        <header className="card-header">
            <p className="card-header-title">{props.title}</p>
        </header>
    )
}

const Content = (props: { children: React.ReactNode }) => {
    return (
        <div className="card-content">
            <div className="content">
                {props.children}
            </div>
        </div>
    )
}

const Footer = (props: { children: React.ReactNode, noWrap: boolean }) => {
    if (props.noWrap) {
        return (
            <div className="m-1">
                {props.children}
            </div>
        )
    }

    return (
        <footer className="card-footer">
            {props.children}
        </footer>
    )
}

Card.Header = Header
Card.Content = Content
Card.Footer = Footer

export { Card }