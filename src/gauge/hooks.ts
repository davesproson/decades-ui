import { useEffect, useState } from 'react'
import { GaugeConfig } from './gauge.types'
import { useGetParameters } from '../hooks'
import { getData } from '../plot/plotUtils'
import { useDispatch } from '../redux/store'
import { nullNaN } from '../utils'
import { updateNthGauge } from '../redux/gaugeSlice'

const useGauge = (configsIn: Array<GaugeConfig>) => {

    const parameters = useGetParameters()
    const [configs, setConfigs] = useState<Array<GaugeConfig> | null>(null)

    useEffect(() => {
        if(configs !== null) return
        if(!parameters) return
        const _cf = configsIn.map(config => {
            if (!parameters) return config
            const decadesParam = parameters.find(
                p => p.ParameterName === config.parameter
            )
            if (!decadesParam) return {
                ...config,
                longName: config.parameter,
            }
            return {
                ...config,
                longName: decadesParam.DisplayText,
                units: decadesParam.DisplayUnits
            }
        })
        setConfigs(_cf)
    }, [parameters])

    useEffect(() => {
        if(!configs) return
        const params = configs.map(config => config.parameter)
        const interval = setInterval(() => {
            getData({params: params}).then(data => {
                const _cf = configs.map(config => {
                    const value = data[config.parameter]
                    return {
                        ...config,
                        value: value[value.length - 1]
                    }
                })
                setConfigs(_cf)
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [configsIn, configs])

    return configs
}

interface UseGaugeWidgetReturnType  {
    min: string,
    max: string,
    dangerBelow: string,
    dangerAbove: string,
    setMin: (e: React.ChangeEvent<HTMLInputElement>) => void,
    setMax: (e: React.ChangeEvent<HTMLInputElement>) => void,
    setDangerBelow: (e: React.ChangeEvent<HTMLInputElement>) => void,
    setDangerAbove: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const useGaugeWidget = (config: GaugeConfig & {position: number}): UseGaugeWidgetReturnType => {
    const dispatch = useDispatch()
    const [min, setMin] = useState<string>(config?.min?.toString() || "")
    const [max, setMax] = useState<string>(config?.max?.toString() || "")
    const [dangerBelow, setDangerBelow] = useState<string>(config?.dangerBelow?.toString() || "")
    const [dangerAbove, setDangerAbove] = useState<string>(config?.dangerAbove?.toString() || "")
    
    useEffect(() => {
  
        const configToThunk: GaugeConfig = {
            parameter: config.parameter,
            min: nullNaN(parseFloat(min)),
            max: nullNaN(parseFloat(max)),
            dangerBelow: nullNaN(parseFloat(dangerBelow)),
            dangerAbove: nullNaN(parseFloat(dangerAbove)),
            value: null,
        }

        dispatch(updateNthGauge({position: config.position, config: configToThunk}))
    }, [min, max, dangerBelow, dangerAbove])

    const parse = (e: React.ChangeEvent<HTMLInputElement>, fn: (x: string) => void) => {
        fn(e.target.value)
        const parsed = parseFloat(e.target.value)
        if (e.target.value && isNaN(parsed)) {
            e.target.classList.add("is-danger")
        } else {
            e.target.classList.remove("is-danger")
            
        }
    }

    return {
        min, setMin: (e: React.ChangeEvent<HTMLInputElement>) => parse(e, setMin),
        max, setMax: (e: React.ChangeEvent<HTMLInputElement>) => parse(e, setMax),
        dangerBelow, setDangerBelow: (e: React.ChangeEvent<HTMLInputElement>) => parse(e, setDangerBelow),
        dangerAbove, setDangerAbove: (e: React.ChangeEvent<HTMLInputElement>) => parse(e, setDangerAbove),
    }

}

export { useGauge, useGaugeWidget }