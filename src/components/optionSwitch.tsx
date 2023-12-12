import { useDispatch } from "../redux/store"
import PropTypes from "prop-types"
import { Button } from "./buttons"
import { Control, Field } from "./forms"
import { capitalize } from "../utils"

interface OptionSwitchProps {
    value: string
    options: string[]
    toggle: () => { type: string }
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
    const dispatch = useDispatch()

    const OffButton = Button.Light
    const OnButton = Button.Info

    const LeftButton = props.value === props.options[0] ? OnButton : OffButton
    const RightButton = props.value === props.options[1] ? OnButton : OffButton

    const toggle = props?.useStore === false
        ? props.toggle
        : () => dispatch(props.toggle())

    return (
        <Field addons>
            <Control>
                <LeftButton onClick={toggle}>{capitalize(props.options[0])}</LeftButton>
            </Control>
            <Control>
                <RightButton onClick={toggle}>{capitalize(props.options[1])}</RightButton>
            </Control>
        </Field>
    )
}
OptionSwitch.propTypes = {
    value: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggle: PropTypes.func.isRequired
}

export default OptionSwitch