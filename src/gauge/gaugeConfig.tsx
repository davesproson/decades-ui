import { Button } from "../components/buttons"
import OptionSwitch from "../components/optionSwitch"
import { Panel } from "../components/panel"
import { OptionBlock } from "../options/plotOptions"
import { toggleDirection } from "../redux/gaugeSlice"
import { useSelector, useDispatch } from "../redux/store"
import { GaugeConfig, GaugePanelProps } from "./gauge.types"
import { addGauges } from "../redux/gaugeSlice"
import { Input } from "../components/forms"
import { useBrainFade } from "../hooks"
import { useGaugeWidget } from "./hooks"
import { Parameter } from "../redux/parametersSlice"

const createGaugeConfig = (param: Parameter) => {
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

const GaugeGlobalOptions = (props: GaugePanelProps) => {

    const params = useSelector(state => state.vars.params)
    const selectedParams = params.filter(param => param.selected)
    const dispatch = useDispatch()

    let buttonText = selectedParams.length > 1 ? "Add Gauges" : "Add Gauge"

    let disableButton = false
    if (!selectedParams.length)
        disableButton = true

    const handleAddGauge = () => {
        const gauges = selectedParams.map(param => createGaugeConfig(param))
        dispatch(addGauges(gauges))
    }

    const alignmentSwitch = (
        <OptionSwitch options={["row", "column"]}
            value={props.direction}
            toggle={toggleDirection} />
    )

    return (
        <>
            <OptionBlock title="Alignment"
                optionComponent={alignmentSwitch} />
            <div className="mt-2">
                <Button.Info fullWidth outlined onClick={handleAddGauge} disabled={disableButton}>{buttonText}</Button.Info>
            </div>
        </>
    )
}

const GaugeConfigWidget = (props: GaugeConfig & {position: number}) => {

    const conf = useGaugeWidget(props)

    return (
        <>
            <OptionBlock title="Minumum value to display" >
                <Input value={conf.min} onChange={conf.setMin}/>
            </OptionBlock>
            <OptionBlock title="Maxmum value to display" >
                <Input value={conf.max} onChange={conf.setMax}/>
            </OptionBlock>
            <OptionBlock title="Warn when below" >
                <Input value={conf.dangerBelow} onChange={conf.setDangerBelow}/>
            </OptionBlock>
            <OptionBlock title="Warn when above" >
                <Input value={conf.dangerAbove} onChange={conf.setDangerAbove}/>
            </OptionBlock>
        </>
    )
}

const GaugeConfigurator = () => {

    const gaugeConfig = useSelector(state => state.gauges)
    const params = useSelector(state => state.vars.params)
    const ref = useBrainFade<HTMLDivElement>()

    return (
        <div ref={ref} className="container has-navbar-fixed-top disappear">
            <Panel.Dark title="Gauge Options">
                <GaugeGlobalOptions {...gaugeConfig} />
            </Panel.Dark>

            {gaugeConfig.configs.map((config, i) => {
                const param = params.find(param => param.raw === config.parameter)
                return (
                    <Panel.Dark title={param?.name || config.parameter} key={i}>
                        <GaugeConfigWidget key={i} position={i} {...config} />
                    </Panel.Dark>
                )
            })}

        </div>
    )
}

export default GaugeConfigurator
