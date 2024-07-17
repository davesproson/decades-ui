interface OptionBlockProps {
    flexDirection?: 'row' | 'column'
    title?: string
    optionComponent?: JSX.Element
    children?: JSX.Element | JSX.Element[]
}
const OptionBlock = (props: OptionBlockProps) => {

    const titleElem = props.title ? <span className="mt-2">{props.title}</span> : null

    return (
        <div className="flex justify-between mt-3 mb-3">
            {titleElem}
            {props.optionComponent || props.children}
        </div>
    )
}

export { OptionBlock }