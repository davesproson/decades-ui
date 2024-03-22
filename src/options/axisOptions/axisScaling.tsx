import { useSelector, useDispatch } from "../../redux/store"

import { setAxisScaling } from "../../redux/parametersSlice"
import { OptionBlock } from "../plotOptions"
import { Button } from "../../components/buttons"
import { Input } from "../../components/forms"
import { Axis } from "../../redux/parametersSlice"
import { Panel } from "../../components/panel"

const AxisScalingWidget = ({axis}: {axis: Axis}) => {
    const dispatch = useDispatch()

    const toggleAutoScaling = () => {
        dispatch(setAxisScaling({
            axisId: axis.id,
            scaling: {
                ...axis.scaling,
                auto: !axis.scaling.auto
            }
        }))
    }

    const upperBound = axis.scaling?.max
    const lowerBound = axis.scaling?.min

    const setBound = (value: {auto?: boolean, min?: string, max?: string}) => {
        dispatch(setAxisScaling({
            axisId: axis.id,
            scaling: {
                ...axis.scaling,
                ...value
            }
        }))
    }

    const boundValidator = (value: string) => {
        if (value === "") {
            return false
        }
        const parsed = parseFloat(value)
        if (isNaN(parsed)) {
            return false
        }
        return true
    }

    const lowerBoundInput = axis.scaling?.auto 
        ? null 
        : <Input kind={boundValidator(lowerBound) ? "success" : "danger"} placeholder="Axis minimum" value={lowerBound} onChange={e=>setBound({min: e.target.value})} />

    const upperBoundInput = axis.scaling?.auto
        ? null
        : <Input kind={boundValidator(upperBound) ? "success" : "danger"} placeholder="Axis maximum" value={upperBound} onChange={e=>setBound({max: e.target.value})} />

    const button = axis.scaling?.auto
        ? <Button.Primary onClick={toggleAutoScaling} >Autoscale</Button.Primary>
        : <Button.Secondary onClick={toggleAutoScaling}>Autoscale</Button.Secondary>

    return (
        <div className="is-flex">
            {button}
            {lowerBoundInput}
            {upperBoundInput}
        </div>
    )
}

const AxisScalingGroup = ({axes}: {axes: Array<Axis>}) => {
    return axes.map(axis => {

        const optionTitle = `Axis ${axis.id} (${axis.units})`

        return (
            <OptionBlock key={axis.id} title={optionTitle}>
                <AxisScalingWidget axis={axis} />
            </OptionBlock>
        )
    })
}

const AxisScalingCard = () => {

    const axes = useSelector(state => state.vars.axes)

    return (
        <Panel.Dark title="Axis Scaling">
            <AxisScalingGroup axes={axes} />
        </Panel.Dark>
    )
}

export { AxisScalingCard }