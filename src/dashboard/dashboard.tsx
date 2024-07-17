import { Button } from "@/components/ui/button";
import { useGetParameters } from "@/parameters/hooks";
import { DecadesParameter } from "@/redux/parametersSlice";
import { badData } from "@/settings";
import { useState } from "react";
import { SimplePlot } from "../plot/plot";
import { useDashboardData } from "./hooks";
import type { DashboardOptions } from "./types";

import { Card } from "@/components/ui/card";
import {
    ContextMenu, 
    ContextMenuCheckboxItem, 
    ContextMenuContent, 
    ContextMenuSub, 
    ContextMenuSubContent, 
    ContextMenuSubTrigger, 
    ContextMenuTrigger
} from "@/components/ui/context-menu";

import useMeasure from 'react-use-measure';

interface DashHeaderProps {
    title: string,
    inAlarm?: boolean,
    maximize: () => void
}
const DashHeader = (props: DashHeaderProps) => {
    let alarmClass = "bg-background "
    if (props.inAlarm) alarmClass = "bg-destructive "

    return (
        <div className={alarmClass + "flex justify-center items-center font-bold rounded-t-lg"}>
            <Button size="sm" variant="ghost" onClick={props.maximize}>
                {props.title}
            </Button>
        </div>
    )
}

interface DashDisplayProps {
    value: number | null,
    units: string,
    inAlarm?: boolean,
    fontSize?: number | string
}
const DashDisplay = (props: DashDisplayProps) => {
    let alarmClass = ""
    if (props.inAlarm) alarmClass = "bg-destructive "
    const fontSize = props.fontSize || 3
    const fontSizeStr = `${fontSize}px`

    const text = (props.value === null || props.value === badData)
        ? "No Data"
        : `${props.value?.toFixed(2)}`

    return (
        <div className={alarmClass + " flex flex-1 h-full justify-center items-center rounded-b-lg "} style={{ fontSize: fontSizeStr }}>
            {text}
            <span className="text-xs text-muted-foreground ml-2">
                {props.units}
            </span>
        </div>
    )
}

interface DashProps {
    value: number[] | null,
    param: DecadesParameter,
    limits: { param: string, min: number, max: number }[],
    maximized: boolean,
    setMaximized: (param: string | null) => void,
    fontSize?: number | string,
    width?: number,
    height?: number,
    left?: number,
    top?: number
}
const Dash = (props: DashProps) => {

    const maximize = () => {
        if (props.maximized) {
            props.setMaximized(null)
            return
        }
        props.setMaximized(props.param.ParameterName)
    }

    const filteredValue = props?.value?.filter(x => x !== badData) || []

    const value = filteredValue.length
        ? filteredValue[filteredValue.length - 1]
        : null

    let inAlarm = false

    const limit = props.limits.filter(x => x.param === props.param.ParameterName)[0]
    if (limit) {
        if ((value !== null) && (limit.min > value || limit.max < value)) {
            inAlarm = true
        }
    }

    const outerStyle: React.CSSProperties = props.maximized
        ? { position: "fixed", inset: 20, zIndex: 1000 }
        : { width: props.width, height: props.height, position: "absolute", left: props.left, top: props.top }

    const innerStyle: React.CSSProperties = props.maximized
        ? { display: "flex", flexDirection: "column", position: "relative", inset: 0, height: "100%" }
        : { height: "100%", display: "flex", flexDirection: "column", }

    const contents = props.maximized
        ? <SimplePlot params={[props.param.ParameterName]} style={{ height: "95%" }} />
        : <DashDisplay fontSize={props.fontSize} value={value} units={props.param.DisplayUnits} inAlarm={inAlarm} />

    return (
        <Card style={outerStyle}>
            <div style={innerStyle} className="rounded-lg">
                <DashHeader title={props.param.DisplayText} inAlarm={inAlarm} maximize={maximize} />
                {contents}
            </div>
        </Card>
    )
}


interface RedashProps {
    params: string[],
    server?: string,
    limits?: { param: string, min: number, max: number }[],
    useURL?: boolean
}
const Redash = (props: RedashProps) => {

    const availableParams = useGetParameters()
    const [maximized, setMaximized] = useState<string | null>(null)
    const searchParams = new URLSearchParams(location.search)
    const [fontSize, setFontSize] = useState(24)
    const [ref, { width, height }] = useMeasure();

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

    const ratio = width / height
    const nCols = Math.min(Math.floor(ratio * 2.5), props.params.length)
    const nRows = Math.ceil(props.params.length / nCols)

    const _width = width / nCols
    const _height = height / nRows

    return (
        <ContextMenu>

            <ContextMenuTrigger>

                <div ref={ref} className="absolute inset-2">
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
                                width={_width - 2}
                                height={_height - 2}
                                left={((_i % nCols) * _width)}
                                top={Math.floor(_i / nCols) * _height}
                            />
                        )
                    })
                    }
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>Set font size</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        {[12, 24, 36, 48].map((size) => {
                            return (
                                <ContextMenuCheckboxItem checked={size === fontSize} onClick={() => setFontSize(size)}>
                                    {size} px
                                </ContextMenuCheckboxItem>
                            )
                        })}
                    </ContextMenuSubContent>
                </ContextMenuSub>


            </ContextMenuContent>
        </ContextMenu>

    );
}

interface DashboardDispatcherProps {
    params?: string[],
    compact?: boolean,
    server?: string,
    limits?: { param: string, min: number, max: number }[],
    useURL?: boolean
}
const DashboardDispatcher = (props: DashboardDispatcherProps) => {
    const searchParams = new URLSearchParams(location.search)
    const params = props.params || (() => {
        const params = (searchParams.get("params") || '').split(",")
        return params
    })()
    const server = props.server || searchParams.get("server") || location.host
    const limits = props.limits

    return (
        <Redash limits={limits}
            params={params} server={server}
            useURL={props.useURL || true} />

    )
}

export default DashboardDispatcher
export { Redash };
