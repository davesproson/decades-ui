import { useSearchParams } from "react-router-dom";
import "../../assets/css/no-scroll.css"
import { useGetParameters } from "../hooks";
import { useDashboardData } from "../dashboard/hooks";
import { DashboardOptions } from "../dashboard/dashboard.types";
import { DecadesParameter } from "../redux/parametersSlice";
import { badData } from "../settings";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface DashHeaderProps {
    title: string,
    inAlarm?: boolean
}
const DashHeader = (props: DashHeaderProps) => {
    let alarmClass = ""
    if(props.inAlarm) alarmClass = "has-background-danger-dark"

    const headerStyle: React.CSSProperties = {
        fontSize: "1.5vmin",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontWeight: "bold"
    }

    return (
        <div className={alarmClass} style={headerStyle}>
            {props.title}
        </div>
    )
}

interface DashDisplayProps {
    value: number | null,
    units: string,
    inAlarm?: boolean
}
const DashDisplay = (props: DashDisplayProps) => {
    let alarmClass = ""
    if(props.inAlarm) alarmClass = "has-background-danger-light"

    const text = (props.value == null || props.value === badData)
        ? "No Data"
        : `${props.value?.toFixed(2)} ${props.units}`

    return (
        <div className={alarmClass} style={{ padding: "5px", fontSize: "3vmin", display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
            {text}
        </div>
    )
}

interface DashProps {
    value: number[] | null,
    param: DecadesParameter,
    limits: { param: string, min: number, max: number }[]
}
const Dash = (props: DashProps) => {

    const value = props.value
        ? props.value[props.value.length - 1]
        : null

    let inAlarm = false

    const limit = props.limits.filter(x => x.param === props.param.ParameterName)[0]
    if(limit) {
        if ((value != null) && (limit.min > value || limit.max < value)) {
            inAlarm = true
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", padding: "5px", borderRadius: "5px" }}>
            <div style={{ border: "2px solid gray", flexGrow: 1, borderRadius: "5px", display: "flex", flexDirection: "column" }}>
                <DashHeader title={props.param.DisplayText} inAlarm={inAlarm}/>
                <DashDisplay value={value} units={props.param.DisplayUnits} inAlarm={inAlarm}/>
            </div>
        </div>
    )
}


interface RedashProps {
    params: string[],
    server?: string,
    limits?: { param: string, min: number, max: number }[],
    useURL?: boolean
}
const Redash = (props: RedashProps) => {

    const ratio = 1.8

    const ref = useRef<HTMLDivElement>(null)
    const availableParams = useGetParameters()
    const [searchParams, _] = useSearchParams()
    const [singleColumn, setSingleColumn] = useState(false)

    useEffect(() => {
        if(ref.current) {
            if(ref.current.clientWidth * 1.8 < ref.current.clientHeight) {
                setSingleColumn(true)
            }
        }
    }, [ref.current])

    let limits = searchParams.getAll('limits').map(x => {
        const [param, min, max] = x.split(',')
        return { param: param, min: parseFloat(min), max: parseFloat(max) }
    })

    if (props.limits) {
        limits = [...limits, ...props.limits]
    }

    const parameters = props.params
    const server = props.server

    const dataOptions: DashboardOptions = {
        params: parameters,
        server: server
    }
    if (server) dataOptions.server = server

    const data = useDashboardData(dataOptions)

    if (!availableParams) return <></>

    let filteredParams = availableParams.filter(x => {
        return parameters.includes(x.ParameterName)
    })

    for (let p of parameters) {
        if (!filteredParams.find(x => x.ParameterName === p)) {
            filteredParams.push({
                ParameterName: p,
                DisplayText: p,
                ParameterIdentifier: 0,  // Here for type checking
                DisplayUnits: "",
                available: true
            })
        }
    }


    const nRows = singleColumn
        ?   props.params.length
        :   Math.sqrt(props.params.length * ratio)

    const nCols = singleColumn
        ? 1  
        : Math.ceil(props.params.length / nRows)

    const style = {
        display: "grid",
        // gridAutoFlow: "column"
        gridTemplateColumns: `repeat(${nCols}, 1fr)`,
        gridTemplateRows: `repeat(${nRows}, 1fr)`,
        width: "100%",
        height: "100%",
        overflow: "hidden"
    }

    
    return (
        <div ref={ref} style={style}>
            {filteredParams.map((param, _i) => {
                const paramName = param.ParameterName
                return (
                    <div key={paramName} style={{ padding: "5px" }}>
                        <Dash
                            key={paramName}
                            value={data ? data[paramName] : null}
                            param={param}
                            limits={limits.filter(y => y.param === param.ParameterName) || [{
                                param: 'undefined',
                                min: 0,
                                max: 0
                            }]}
                        />
                    </div>
                )
            })
            }
        </div>
    );
}

interface DashboardDispatcherProps {
    params?: string[],
    compact?: boolean,
    server?: string,
    limits?: { param: string, min: number, max: number }[],
    useURL?: boolean
}
const RedashboardDispatcher = (props: DashboardDispatcherProps) => {
    const [searchParams, _] = useSearchParams();
    const params = props.params || (() => {
        const params = (searchParams.get("params") || '').split(",")
        return params
    })()
    // const isCompact = props.compact || searchParams.get("compact") == "true"
    const server = props.server || searchParams.get("server") || location.host
    const limits = props.limits
    // const size = isCompact ? "small" : "large"

    return <Redash limits={limits}
        params={params} server={server}
        useURL={props.useURL || true} />
}

export default RedashboardDispatcher
export { Redash }