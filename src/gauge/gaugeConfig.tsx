import { Button } from "../components/buttons"
import OptionSwitch from "../components/optionSwitch"
import { Panel } from "../components/panel"
import { OptionBlock } from "../options/plotOptions"
import { toggleDirection } from "../redux/gaugeSlice"
import { useSelector, useDispatch } from "../redux/store"
import { GaugeConfig, GaugePanelProps } from "./gauge.types"
import { addGauges, clearGauges } from "../redux/gaugeSlice"
import { Input } from "../components/forms"
import { Container } from "../components/container"
import { useGaugeWidget } from "./hooks"
import { Parameter } from "../redux/parametersSlice"
import { FadeOut } from "../components/fadeout"

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
    const disableButton = !!selectedParams.length

    const alignmentSwitch = (
        <OptionSwitch options={["row", "column"]}
            value={props.direction}
            toggle={toggleDirection} />
            )
            

    const ClearButton = () => gaugeConfig.configs.length
        ? <Button.Danger fullWidth onClick={() => dispatch(clearGauges())}>Clear All</Button.Danger>
        : null

    return (
        <>
            <OptionBlock title="Alignment"
                optionComponent={alignmentSwitch} />
            <div className="mt-2">
                <Button.Info fullWidth outlined onClick={handleAddGauge} disabled={disableButton}>{buttonText}</Button.Info>
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
const GaugeConfigWidget = (props: GaugeConfig & {position: number}) => {

    const conf = useGaugeWidget(props)

    return (
        <FadeOut>
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
        </FadeOut>
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
        <FadeOut>
            <Container fixedNav>
                <Panel.Dark title="Gauge Options">
                    <GaugeGlobalOptions {...gaugeConfig} />
                </Panel.Dark>

                {gaugeConfig.configs.map((config, i) => {
                    const param = params.find(param => param.raw === config.parameter)

                    const title = (()=>{
                        let name = param?.name || config.parameter
                        if(param?.units) name += ` (${param.units})`
                        return name
                    })()

                    return (
                        <Panel.Dark title={title} key={i}>
                            <GaugeConfigWidget key={i} position={i} {...config} />
                        </Panel.Dark>
                    )
                })}

            </Container>
        </FadeOut>
    )
}

export default GaugeConfigurator
