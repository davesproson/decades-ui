export const GroupedField = (props: {children: any}) => {
    return (
        <div className="field is-grouped">
            {props.children}
        </div>
    )
}

interface FieldProps {
    children: any,
    addons?: boolean,
    grouped?: boolean,
    expanded?: boolean,
}
export const Field = (props: FieldProps) => {

    const { children, addons, grouped, expanded } = props

    let fieldClass = "field"
    if(addons) fieldClass += " has-addons"
    if(grouped) fieldClass += " is-grouped"
    if(expanded) fieldClass += " is-expanded"

    return (
        <div className={fieldClass}>
            {children}
        </div>
    )
}

export const FieldInput = (props: any) => {
    return (
        <Field>
            <Input {...props} />
        </Field>
    )
}

interface ControlProps {
    children: any,
    expanded?: boolean,
}
export const Control = (props: ControlProps) => {
    const { children, expanded } = props
    let controlClass = "control"
    if(expanded) controlClass += " is-expanded"

    return (
        <div className={controlClass}>
            {children}
        </div>
    )
}

interface LabelProps {
    children: any,
}
export const Label = (props: LabelProps) => {
    const { children } = props
    return (
        <label className="label">
            {children}
        </label>
    )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    kind?: string,
}
const Input = (props: InputProps) => {

    let inputClass = "input"
    if(props.kind) inputClass += ` is-${props.kind}`

    return (
        <div className="control">
            <input className={inputClass}
                    {...props} />
        </div>
    )
}


Input.Primary = (props: any) => {
    return (
        <Input kind="primary" {...props} />
    )
}

export { Input }