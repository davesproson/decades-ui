import { Button } from "@/components/ui/button"

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

interface OptionSwitchProps {
    value: string
    options: string[]
    toggle: () => { type: string }
    small?: boolean
    useStore?: boolean
}
/**
 * A component that allows the user to select between two options.
 * Dispatches the toggle action using a given reducer.
 * 
 * @param {Object} props - The props for the component
 * @param {string} props.value - The current value of the option
 * @param {Array} props.options - The options to choose between
 * @param {Function} props.toggle - The action to dispatch or the function to call when the option is toggled
 * @param {boolean} [props.useStore] - Whether to use the redux store
 * 
 * @component
 * @example
 * const options = ["on", "off"]
 * const value = "on"
 * const toggle = () => { return { type: "TOGGLE" } }
 * return (
 * <OptionSwitch value={value} options={options} toggle={toggle} />
 * )
 */
const OptionSwitch = (props: OptionSwitchProps) => {
    const small = props.small ? true : false

    return (
        <>
            <Button className="rounded-r-none" variant={props.value === props.options[0] ? "default": "outline"} size={small?"sm":"default"} onClick={props.toggle}>{capitalize(props.options[0])}</Button>
            <Button className="rounded-l-none" variant={props.value === props.options[1] ? "default": "outline"} size={small?"sm":"default"} onClick={props.toggle}>{capitalize(props.options[1])}</Button>
        </>
    )
}

export { OptionSwitch }