import { useSelector, useDispatch } from "react-redux"
import { PropTypes } from "prop-types"
import { OptionBlock } from "../plotOptions"
import { addNewAxis, selectAxis } from "../../redux/parametersSlice"
import { Button } from "../../components/buttons"

/**
 * A button that adds a new axis to a given parameter. By default, all parameters
 * with the same units will be added to the same axis. This button allows the user
 * to add a new axis for a given parameter.
 * 
 * Dispatches the addNewAxis action.
 * 
 * @param {Object} props - The props for the component
 * @param {Object} props.param - The parameter to add a new axis for
 * 
 * @component
 * @example
 * return (
 * <AddAxisButton param={param} />
 * )
 */
const AddAxisButton = (props) => {
    const dispatch = useDispatch()

    const addAxis = () => {
        dispatch(addNewAxis({
            paramId: props.param.id
        }))
    }

    return (
        <Button.Primary onClick={addAxis}>+</Button.Primary>
    )
}
AddAxisButton.propTypes = {
    param: PropTypes.shape({
        id: PropTypes.string.isRequired
    })
}

/**
 * A component that allows the user to select an axis for a given parameter.
 * 
 * Uses state from parametersSlice.
 * 
 * Dispatches the selectAxis action.
 * 
 * @param {Object} props - The props for the component
 * @param {Object} props.param - The parameter to select an axis for
 * 
 * @component
 * @example
 * return (
 * <AxisSelectorItem param={param} />
 * )
 */
const AxisSelectorItem = (props) => {
    const axes = useSelector(state => state.vars.axes)
    const dispatch = useDispatch()

    const axesOptions = axes.filter(x => x.units == props.param.units).map(x => {
        return <option key={x.id}  value={x.id}>Axis {x.id} ({x.units})</option>
    })

    const changeAxis = (event) => {
        dispatch(selectAxis({
            axisId: parseInt(event.target.value),
            paramId: props.param.id
        }))
    }

    return (
        <div className="field has-addons">
            <div className="control is-flex-grow-1">
                <div className="select is-fullwidth">
                    <select value={props.param.axisId} onChange={changeAxis}>
                        {axesOptions}
                    </select>
                </div>
            </div>
            <AddAxisButton param={props.param} />
        </div>
    )
}
AxisSelectorItem.propTypes = {
    param: PropTypes.shape({
        id: PropTypes.string.isRequired,
        axisId: PropTypes.number,
        units: PropTypes.string.isRequired
    })
}

/**
 * A component that renders a group of AxisSelectorItem components
 * inside an OptionBlock.
 * 
 * Uses state from parametersSlice.
 * 
 * @component
 * @example
 * return (
 * <AxisSelectorGroup />
 * )
 */
const AxisSelectorGroup = () => {
    const vars = useSelector(state => state.vars)
    return vars.params.filter(x => x.selected).map(
        x => <OptionBlock key={x.id} 
                          title={`${x.name} (${x.units})`} 
                          optionComponent={<AxisSelectorItem key={x.id} param={x} />}
                          flexDirection="column" />
    )
}

/**
 * A component that renders a card with a group of AxisSelectorItem components.
 * 
 * @component
 * @example
 * return (
 * <AxisOptionsCard />
 * )
 */
const AxisSelectionCard = () => {
    return (
        <nav className="panel mt-4 is-dark">
            <p className="panel-heading">
                Axis selection
            </p>
            <div className="p-4">
                <AxisSelectorGroup />
            </div>
        </nav>
    )
}

export { AxisSelectionCard }