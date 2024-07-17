import { useState, useEffect } from 'react'
import { getData } from '@/data/utils'
import { badData } from '@/settings'
import { decode, encode } from 'base-64'
import { evaluate } from 'mathjs'
import { AlarmOptions, AlarmListProps, AlarmProps } from './types'
import { DecadesDataResponse } from '@/data/types'


const useAlarmUrl = (setAlarms: React.Dispatch<AlarmProps[]>, props: AlarmListProps) => {

    const searchParams = new URLSearchParams(window.location.search)
    const setSearchParams = (params: URLSearchParams) => {
        const newUrl = new URL(window.location.href)
        newUrl.search = params.toString()
        window.history.pushState({}, "", newUrl.toString())
    }

    useEffect(() => {
        try {
            const urlAlarms = searchParams.getAll("alarm").map(x=>JSON.parse(decode(x)))
            setAlarms(urlAlarms.map((a, _i) => ({...a, id: a.name})))
        } catch (e) {
            alert("Error parsing alarms specified in URL")
            setSearchParams(new URLSearchParams())
            console.log("Error parsing URL alarms")
            console.error(e)
        }
    }, [])


    const removeAlarm = (id: any/*TODO ?*/) => {
        const alarms = searchParams.getAll("alarm").map(x=>JSON.parse(decode(x)))
                                                   .filter(x=>x.name !== id)
        
        const newSearchParams = new URLSearchParams()
        for(let alarm of alarms) {
            newSearchParams.append("alarm", encode(JSON.stringify(alarm)))
        }
        setSearchParams(newSearchParams)
    }

    const alarmParams: {[key: string]: any} = {}
    for(let k of searchParams.keys()) {
        if(k !== "alarm") {
            alarmParams[k] = searchParams.getAll(k)
            if(alarmParams[k].length === 1) alarmParams[k] = alarmParams[k][0]
        }
    }
    
    if(props.alarms) {
        return [null, {}]
    }

    console.log(alarmParams)
    return [removeAlarm, alarmParams]
}


const useAlarm = (props: AlarmProps) => {

    // const [passing, setPassing] = useState(props.passing)
    const [passing, setPassing] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        const runAlarms = async () => {
                
            const end = Math.floor(new Date().getTime() / 1000)
            const start = end - (props.interval || 5)

            let data: DecadesDataResponse
            const dataOut: {[key: string]: number|null} = {}

            const options: AlarmOptions = {
                params: props.parameters,
            }

            try {
                data = await getData(options, start)
            } catch (e) {
                const alarmValue = props.failOnNoData ? false : undefined
                setPassing(alarmValue)
                return
            }
            
            for(let param of Object.keys(data)) {
                try {
                    dataOut[param] = data[param].filter((d) => d !== null)
                                             .filter((d) => d !== badData)
                                             .reverse()[0]
                    if(data[param] === undefined) throw("No data")
                } catch (e) {
                    dataOut[param] = null
                    const alarmValue = props.failOnNoData ? false : undefined
                    setPassing(alarmValue)
                    return
                }
            }
            
            try {
                const passing = evaluate(props.rule, {...dataOut})
                setPassing(passing)
            } catch (e) {
                console.log("Error evaluating alarm rule")
                console.log(e)

                const alarmValue = props.failOnNoData ? false : undefined
                setPassing(alarmValue)
            }
            
        }

        runAlarms()
        
        const interval = setInterval(runAlarms, props.interval ? props.interval * 1000 : 5000)
        return () => clearInterval(interval)
    }, [setPassing])

    return passing
}

const useFlash = (delay: number) => {
    const [flash, setFlash] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => setFlash(x=>!x), delay)
        return () => clearInterval(interval)
    }, [delay, setFlash])

    return flash
}

export { useAlarm, useAlarmUrl, useFlash }