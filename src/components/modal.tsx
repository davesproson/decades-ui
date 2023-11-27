interface ModalProps {
    active: boolean
    close: () => void
    children: React.ReactNode
}

const Modal = (props: ModalProps) => {
    const active = props.active ? "is-active" : ""

    return (
        <div className={`modal ${active}`}>
            <div className="modal-background"></div>
            {props.children}
            <button className="modal-close is-large" aria-label="close" onClick={props.close}></button>
        </div>
    )
}

interface ContentProps {
    children: React.ReactNode
}
const Content = (props: ContentProps) => {
    return (
        <div className="modal-content">
            {props.children}
        </div>
    )
}



Modal.Content = Content

export { Modal }