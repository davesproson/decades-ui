import { Button } from "@/components/ui/button"
import { toggleDirection } from "@/redux/gaugeSlice"
import { useSelector, useDispatch } from "@store"
import type { GaugeConfig, GaugePanelProps } from "./types"
import { addGauges, clearGauges } from "@/redux/gaugeSlice"
import { useGaugeWidget } from "./hooks"
import { Parameter } from "@/redux/parametersSlice"
import { OptionSwitch } from "@/components/ui/option-switch"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DecadesBreadCrumb } from "@/components/ui/breadcrumb"
import { ParameterDispatcher } from "@/parameters/parameter-dispatcher"

/**
 * Define an object that contains the configuration for the gauge panel.
 * @param param - a Parameter, as defined in the parametersSlice.
 * 
 * @returns a GaugeConfig object.
 */
const createGaugeConfig = (param: Parameter): GaugeConfig => {
    return {
        parameter: param.raw,
        units: param.units || undefined,
        value: null,
        min: null,
        max: null,
        dangerAbove: null,
        dangerBelow: null,
    }
}

/**
 * This component provides a global configuration for the gauge panel.
 * It is used in the GaugeConfigurator component.
 * 
 * @param {GaugePanelProps} props - The configuration for the gauge panel.
 * 
 * @component
 * @example
 * return (
 *  <GaugeGlobalOptions direction="row" />
 * )
 */
const GaugeGlobalOptions = (props: GaugePanelProps) => {

    const params = useSelector(state => state.vars.params)
    const gaugeConfig = useSelector(state => state.gauges)
    const dispatch = useDispatch()

    const selectedParams = params.filter(param => param.selected)

    const handleAddGauge = () => {
        const gauges = selectedParams.map(param => createGaugeConfig(param))
        dispatch(addGauges(gauges))
    }

    let buttonText = selectedParams.length > 1 ? "Add Gauges" : "Add Gauge"
    const disableButton = !selectedParams.length

    const ClearButton = () => gaugeConfig.configs.length
        ? <Button variant="destructive" className="w-full" onClick={() => dispatch(clearGauges())}>Clear All</Button>
        : null

    return (
        <>
            <OptionSwitch
                options={["row", "column"]}
                value={props.direction}
                toggle={() => dispatch(toggleDirection())}
            />
            <div className="mt-2">
                <Button className="w-full" onClick={handleAddGauge} disabled={disableButton}>{buttonText}</Button>
            </div>
            <div className="mt-2">
                <ClearButton />
            </div>
        </>
    )
}

/**
 * This component provides a configuration panel for individual gauges.
 * It is used in the GaugeConfigurator component.
 * 
 * @param {GaugeConfig} props - The configuration for the gauge.
 * @param {number} props.position - The position of the gauge in the gauge panel.
 * 
 * @component
 * @example
 * return (
 *  <GaugeConfigWidget position={0} parameter="temperature" min={0} max={100} dangerAbove={90} dangerBelow={10} />
 * )
 */
const GaugeConfigWidget = (props: GaugeConfig & { position: number }) => {

    const conf = useGaugeWidget(props)

    return (
        <>
            <div className="flex justify-between flex-col md:flex-row">
                <Label className="mt-4">Minimum value to display</Label>
                <Input type="number" className="m-1 w-[200px]" value={conf.min} onChange={conf.setMin} />
            </div>
            <div className="flex justify-between flex-col md:flex-row">
                <Label className="mt-4">Maximum value to display</Label>
                <Input type="number" className="m-1 w-[200px]" value={conf.max} onChange={conf.setMax} />
            </div>
            <div className="flex justify-between flex-col md:flex-row">
                <Label className="mt-4">Warn when below</Label>
                <Input type="number" className="m-1 w-[200px]" value={conf.dangerBelow} onChange={conf.setDangerBelow} />
            </div>
            <div className="flex justify-between flex-col md:flex-row">
                <Label className="mt-4">Warn when above</Label>
                <Input type="number" className="m-1 w-[200px]" value={conf.dangerAbove} onChange={conf.setDangerAbove} />
            </div>
        </>
    )
}

/**
 * This is the main component for configuring gauges. It provides a global
 * configuration for the gauge panel and individual configurations for each
 * gauge.
 *
 * @component
 * @example
 * return (
 *  <GaugeConfigurator />
 * )
 */
const GaugeConfigurator = () => {

    const gaugeConfig = useSelector(state => state.gauges)
    const params = useSelector(state => state.vars.params)

    return (
        <ParameterDispatcher>
            <div className="mb-2">
                <DecadesBreadCrumb
                    crumbs={[
                        { label: "Configure Gauges" },
                    ]} />

                <GaugeGlobalOptions {...gaugeConfig} />

                {gaugeConfig.configs.map((config, i) => {
                    const param = params.find(param => param.raw === config.parameter)

                    const title = (() => {
                        let name = param?.name || config.parameter
                        if (param?.units) name += ` (${param.units})`
                        return name
                    })()

                    return (
                        <Card key={i} className="mt-2">
                            <CardHeader>
                                <CardTitle>{title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <GaugeConfigWidget key={i} position={i} {...config} />
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </ParameterDispatcher>

    )
}

export default GaugeConfigurator