import { useDispatch } from "../redux/store"
import PropTypes  from 'prop-types'
import { Button } from './buttons'
import { Control, Field } from './forms'

interface ToggleSwitchProps {
    on: boolean
    toggle: () => { type: string }
}
/**
 * A component that allows the user to toggle an on/off option.
 * Dispatches the toggle action using a given reducer.
 * 
 * @param {Object} props - The props for the component
 * @param {boolean} props.on - The current value of the option
 * @param {Function} props.toggle - The action to dispatch
 * 
 * @component
 * @example
 * const on = true
 * const toggle = () => { return { type: "TOGGLE" } }
 * return (
 * <ToggleSwitch on={on} toggle={toggle} />
 * ) 
 */
const ToggleSwitch = (props: ToggleSwitchProps) => {

    const dispatch = useDispatch()

    const OnButton = props.on ? Button.Success : Button.Light
    const OffButton = props.on ? Button.Light : Button.Danger

    const toggle = () => dispatch(props.toggle())

    return (
        <Field addons>
            <Control>
                <OnButton onClick={toggle}>on</OnButton>
            </Control>
            <Control>
                <OffButton onClick={toggle}>off</OffButton>
            </Control>
        </Field>
    )
}
ToggleSwitch.propTypes = {
    on: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired
}

export default ToggleSwitch