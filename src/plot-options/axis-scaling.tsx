import { useSelector, useDispatch } from "@store"

import { setAxisScaling } from "@/redux/parametersSlice"
import { OptionBlock } from "./utils"
import { Button } from "@/components/ui/button"
// import { Input } from "../../components/forms"
import { Axis } from "@/redux/parametersSlice"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Panel } from "../../components/panel"

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
        : <Input className={boundValidator(lowerBound) ? "border-green-800 mr-2" : "border-red-800  mr-2"} placeholder="Axis minimum" value={lowerBound} onChange={e=>setBound({min: e.target.value})} />

    const upperBoundInput = axis.scaling?.auto
        ? null
        : <Input className={boundValidator(upperBound) ? "border-green-800  mr-2" : "border-red-800  mr-2"} placeholder="Axis maximum" value={upperBound} onChange={e=>setBound({max: e.target.value})} />

    const button = axis.scaling?.auto
        ? <Button onClick={toggleAutoScaling}>Autoscale</Button>
        : <Button onClick={toggleAutoScaling} variant="outline">Autoscale</Button>

    return (
        <div className="flex">
            {lowerBoundInput}
            {upperBoundInput}
            {button}
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
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Axis Scaling</CardTitle>
            </CardHeader>
            <CardContent>
                <AxisScalingGroup axes={axes} />
            </CardContent>
        </Card>
    )
}

export { AxisScalingCard }