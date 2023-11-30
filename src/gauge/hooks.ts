import { useEffect, useState } from 'react'
import { GaugeConfig } from './gauge.types'
import { useGetParameters } from '../hooks'
import { getData } from '../plot/plotUtils'

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
    }, [configsIn])

    return configs
}

export { useGauge }