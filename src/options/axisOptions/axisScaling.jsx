import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"

import { setAxisScaling } from "../../redux/parametersSlice"
import { OptionBlock } from "../plotOptions"
import { Button } from "../../components/buttons"
import { Input } from "../../components/forms"

const AxisScalingWidget = ({axis}) => {
    const dispatch = useDispatch()
    // const [upperBound, setUpperBound] = useState(axis.scaling?.max)
    // const [lowerBound, setLowerBound] = useState(axis.scaling?.min)

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

    const setBound = (value) => {
        dispatch(setAxisScaling({
            axisId: axis.id,
            scaling: {
                ...axis.scaling,
                ...value
            }
        }))
    }

    const boundValidator = (value) => {
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

const AxisScalingGroup = ({axes}) => {
    return axes.map(axis => {
        return (
            <OptionBlock 
                key={axis.id}
                title={`Axis ${axis.id} (${axis.units})`} 
                optionComponent={<AxisScalingWidget axis={axis} />}
            />
        )
    })
}

const AxisScalingCard = () => {

    const axes = useSelector(state => state.vars.axes)
    console.log(axes)

    return (
        <nav className="panel mt-4 is-dark">
            <p className="panel-heading">
                Axis scaling
            </p>
            <div className="p-4">
                <AxisScalingGroup axes={axes} />
            </div>
        </nav>
    )
}

export { AxisScalingCard }