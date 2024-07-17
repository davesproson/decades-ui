import { useSelector, useDispatch } from "@store"
// import { OptionBlock } from "../plotOptions"
import { addNewAxis, selectAxis } from "@/redux/parametersSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OptionBlock } from "./utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface AddAxisButtonProps {
    param: {
        id: string | number,
        axisId: number | null;
        units: string;
        name: string;
    }
}
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
const AddAxisButton = (props: AddAxisButtonProps) => {
    const dispatch = useDispatch()

    const addAxis = () => {
        dispatch(addNewAxis({
            paramId: props.param.id
        }))
    }

    return (
        <Button onClick={addAxis}>+</Button>
    )
}


interface AxisSelectorItemProps {
    param: {
        id: string | number,
        axisId: number | null,
        units: string
        name: string
    }
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
const AxisSelectorItem = (props: AxisSelectorItemProps) => {
    const axes = useSelector(state => state.vars.axes)
    const dispatch = useDispatch()

    const axesOptions = axes.filter(x => x.units === props.param.units).map(x => {
        return <SelectItem key={x.id} value={x.id.toString()}>Axis {x.id} ({x.units})</SelectItem>
    })

    const changeAxis = (name: string) => {
        dispatch(selectAxis({
            axisId: parseInt(name),
            paramId: props.param.id
        }))
    }

    return (
        <div className="flex">
            <Select value={props.param.axisId?.toString()} onValueChange={changeAxis}>
                <SelectTrigger className="w-[300px] mr-2">
                    <SelectValue  placeholder="Select axis..." />
                </SelectTrigger>
                <SelectContent>
                    {axesOptions}
                </SelectContent>
            </Select>
            <AddAxisButton param={props.param} />
        </div>
    )
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
    return vars.params.filter(x => x.selected).map(x => {
        return (
            <OptionBlock key={x.id}
                title={`${x.name} (${x.units})`}
                flexDirection="column" >
                <div key={x.id} >
                    <AxisSelectorItem key={x.id} param={x} />
                </div>
            </OptionBlock>
        )
    })
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
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>
                    Axis selection
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AxisSelectorGroup />
            </CardContent>
        </Card>
    )
}

export { AxisSelectionCard }