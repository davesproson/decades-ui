import { Link } from "react-router-dom"


interface ExtendedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    kind?: string,
    outlined?: boolean,
    fullWidth?: boolean,
    small?: boolean,
    to?: string
    anchor?: boolean,
    extraClasses?: string,
    href?: string,
    rel?: string,
    target?: string,
    style?: React.CSSProperties
}

const Button = (props: ExtendedButtonProps) => {
    let buttonClass = "button"
    if(props.kind) buttonClass += ` is-${props.kind}`
    if(props.outlined) buttonClass += " is-outlined"
    if(props.fullWidth) buttonClass += " is-fullwidth"
    if(props.small) buttonClass += " is-small"
    if(props.extraClasses) {
        buttonClass += ` ${props.extraClasses}`
    }

    if(props.to) {
        return (
            <Link className={buttonClass} to={props.to} role="button">{props.children}</Link>
        )
    }

    if(props.anchor) {
        if(!props.href) console.error("Anchor button requires href prop")
        const hrefProps = {
            href: props.href,
            rel: props.rel || "noopener noreferrer",
            target: props.target || "_blank",
            style: props.style || {}
        }
        return (
            <a className={buttonClass} {...hrefProps}>{props.children}</a>
        )
    }

    const { kind, outlined, fullWidth, small, extraClasses, ...rest } = props
    return (
        <button className={buttonClass} {...rest}>{props.children}</button>
    )
}


// A partial application of the button component to create a primary button
const Primary = (props: ExtendedButtonProps) => {
    return (
        <Button kind="primary" {...props} />
    )
}

// A partial application of the button component to create a secondary button
const Secondary = (props: ExtendedButtonProps) => {
    return (
        <Button kind="secondary" {...props} />
    )
}   

// A partial application of the button component to create a danger button
const Danger = (props: ExtendedButtonProps) => {
    return (
        <Button kind="danger" {...props} />
    )
}

// A partial application of the button component to create a success button
const Success = (props: ExtendedButtonProps) => {
    return (
        <Button kind="success" {...props} />
    )
}

// A partial application of the button component to create a warning button
const Warning = (props: ExtendedButtonProps) => {
    return (
        <Button kind="warning" {...props} />
    )
}

// A partial application of the button component to create a info button
const Info = (props: ExtendedButtonProps) => {
    return (
        <Button kind="info" {...props} />
    )
}

// A partial application of the button component to create a light button
const Light = (props: ExtendedButtonProps) => {
    return (
        <Button kind="light" {...props} />
    )
}

// A partial application of the button component to create a dark button
const Dark = (props: ExtendedButtonProps) => {
    return (
        <Button kind="dark" {...props} />
    )
}

// Export the button component
Button.Primary = Primary
Button.Secondary = Secondary
Button.Danger = Danger
Button.Success = Success
Button.Warning = Warning
Button.Info = Info
Button.Light = Light
Button.Dark = Dark

export { Button }