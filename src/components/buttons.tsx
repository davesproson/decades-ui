import { Link } from "react-router-dom"
import PropTypes  from "prop-types"


const ButtonPropTypes = {
    kind: PropTypes.string,
    outlined: PropTypes.bool,
    fullWidth: PropTypes.bool,
    small: PropTypes.bool,
    children: PropTypes.node.isRequired,
    to: PropTypes.string,
    anchor: PropTypes.bool,
    rest: PropTypes.any,
    onClick: PropTypes.func
}

type CommonButtonProps = {
    kind?: string,
    outlined?: boolean,
    fullWidth?: boolean,
    small?: boolean,
    children: React.ReactNode
    to?: string
    anchor?: boolean,
    extraClasses?: string,
    rest?: any,
    onClick?: () => void
}

const Button = ({kind, outlined, fullWidth, small, to, children, anchor, ...rest}: CommonButtonProps) => {
    let buttonClass = "button"
    if(kind) buttonClass += ` is-${kind}`
    if(outlined) buttonClass += " is-outlined"
    if(fullWidth) buttonClass += " is-fullwidth"
    if(small) buttonClass += " is-small"
    if(extraClasses) buttonClass += ` ${extraClasses}`

    if(to) {
        return (
            <Link className={buttonClass} to={to} role="button">{children}</Link>
        )
    }

    if(anchor) {
        return (
            <a className={buttonClass} {...rest} >{children}</a>
        )
    }

    return (
        <button className={buttonClass} {...rest} >{children}</button>
    )
}
Button.propTypes = ButtonPropTypes


// A partial application of the button component to create a primary button
const Primary = (props: CommonButtonProps) => {
    return (
        <Button kind="primary" {...props} />
    )
}

// A partial application of the button component to create a secondary button
const Secondary = (props: CommonButtonProps) => {
    return (
        <Button kind="secondary" {...props} />
    )
}   

// A partial application of the button component to create a danger button
const Danger = (props: CommonButtonProps) => {
    return (
        <Button kind="danger" {...props} />
    )
}

// A partial application of the button component to create a success button
const Success = (props: CommonButtonProps) => {
    return (
        <Button kind="success" {...props} />
    )
}

// A partial application of the button component to create a warning button
const Warning = (props: CommonButtonProps) => {
    return (
        <Button kind="warning" {...props} />
    )
}

// A partial application of the button component to create a info button
const Info = (props: CommonButtonProps) => {
    return (
        <Button kind="info" {...props} />
    )
}

// A partial application of the button component to create a light button
const Light = (props: CommonButtonProps) => {
    return (
        <Button kind="light" {...props} />
    )
}

// A partial application of the button component to create a dark button
const Dark = (props: CommonButtonProps) => {
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