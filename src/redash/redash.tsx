import { useSearchParams } from "react-router-dom";
import "../../assets/css/no-scroll.css"
import { useGetParameters } from "../hooks";
import { useDashboardData } from "../dashboard/hooks";
import { DashboardOptions } from "../dashboard/dashboard.types";
import { DecadesParameter } from "../redux/parametersSlice";
import { badData } from "../settings";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "../components/buttons";
import { SimplePlot } from "../plot/plot";

interface DashHeaderProps {
    title: string,
    inAlarm?: boolean,
    maximize: () => void
}
const DashHeader = (props: DashHeaderProps) => {
    let alarmClass = "has-background-light"
    if (props.inAlarm) alarmClass = "has-background-danger-dark"

    const headerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontWeight: "bold"
    }

    return (
        <div className={alarmClass} style={headerStyle}>
            <Button small style={{ background: "none", border: "none" }} onClick={props.maximize}>{props.title}</Button>
        </div>
    )
}

interface DashDisplayProps {
    value: number | null,
    units: string,
    inAlarm?: boolean,
    fontSize?: number
}
const DashDisplay = (props: DashDisplayProps) => {
    let alarmClass = ""
    if (props.inAlarm) alarmClass = "has-background-danger-light"
    const fontSize = props.fontSize || 3
    const fontSizeStr = `${fontSize}px`

    const text = (props.value == null || props.value === badData)
        ? "No Data"
        : `${props.value?.toFixed(2)} ${props.units}`

    return (
        <div className={alarmClass} style={{ padding: "5px", fontSize: fontSizeStr, display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
            {text}
        </div>
    )
}

interface DashProps {
    value: number[] | null,
    param: DecadesParameter,
    limits: { param: string, min: number, max: number }[],
    maximized: boolean,
    setMaximized: (param: string | null) => void,
    fontSize?: number
}
const Dash = (props: DashProps) => {

    const maximize = () => {
        if (props.maximized) {
            props.setMaximized(null)
            return
        }
        props.setMaximized(props.param.ParameterName)
    }

    const value = props.value
        ? props.value[props.value.length - 1]
        : null

    let inAlarm = false

    const limit = props.limits.filter(x => x.param === props.param.ParameterName)[0]
    if (limit) {
        if ((value != null) && (limit.min > value || limit.max < value)) {
            inAlarm = true
        }
    }

    const outerStyle: React.CSSProperties = props.maximized
        ? { position: "fixed", top: 5, left: 5, right: 5, bottom: 5, zIndex: 1000 }
        : { display: "flex", flexDirection: "column", height: "100%", width: "100%", padding: "5px", borderRadius: "5px" }

    const innerStyle: React.CSSProperties = props.maximized
        ? { position: "relative", inset: 0, height: "100%", borderRadius: "5px", border: "2px solid gray"}
        : { border: "2px solid gray", flexGrow: 1, borderRadius: "5px", display: "flex", flexDirection: "column" }

    const contents = props.maximized
        ? <SimplePlot params={[props.param.ParameterName]} style={{height: "97%"}} />
        : <DashDisplay fontSize={props.fontSize} value={value} units={props.param.DisplayUnits} inAlarm={inAlarm} />

    return (
        <div style={outerStyle}>
            <div style={innerStyle}>
                <DashHeader title={props.param.DisplayText} inAlarm={inAlarm} maximize={maximize} />
                {contents}
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

    const ref = useRef<HTMLDivElement>(null)
    const availableParams = useGetParameters()
    const [searchParams, _] = useSearchParams()
    const [maximized, setMaximized] = useState<string | null>(null)
    const [ratio, setRatio] = useState(1)
    const [fontSize, setFontSize] = useState(64)

    useLayoutEffect(() => {
        if (!ref.current) return
        const resizeObserver = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect
            setRatio(width / height)
        })
        resizeObserver.observe(ref.current)
        return () => {
            resizeObserver.disconnect()
        }
    }, [ref.current])

    useLayoutEffect(() => {
        if(!ref.current) return
        if (ref.current.clientWidth < ref.current.scrollWidth || ref.current.clientHeight < ref.current.scrollHeight) {
            setFontSize(x=>{
                if(x>8) return x-1
                return x
            })
        }
      }, [ref, ratio, fontSize]);

    const singleColumn = ratio < 0.7

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

    const nCols = singleColumn
        ? 1
        : ratio < 1
            ? Math.min(2, props.params.length)
            : ratio < 1.5
                ? Math.min(3, props.params.length)
                : Math.min(4, props.params.length)

    const nRows = Math.ceil(props.params.length / nCols)

    const style: React.CSSProperties = {
            display: "grid",
            position: "absolute",
            gridTemplateColumns: `repeat(${nCols}, 1fr)`,
            gridTemplateRows: `repeat(${nRows}, 1fr)`,
            inset: 0,
            overflow: "hidden"
        }

    return (
        <div ref={ref} style={style}>
            {filteredParams.map((param, _i) => {
                const paramName = param.ParameterName
                return (
                    <Dash
                        key={paramName}
                        fontSize={fontSize}
                        maximized={maximized === paramName}
                        setMaximized={setMaximized}
                        value={data ? data[paramName] : null}
                        param={param}
                        limits={limits.filter(y => y.param === param.ParameterName) || [{
                            param: 'undefined',
                            min: 0,
                            max: 0
                        }]}
                    />
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
    const server = props.server || searchParams.get("server") || location.host
    const limits = props.limits

    return <Redash limits={limits}
        params={params} server={server}
        useURL={props.useURL || true} />
}

export default RedashboardDispatcher
export { Redash }