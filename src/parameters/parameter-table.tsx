import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import { Check, X, CircleHelp, OctagonX, Info } from "lucide-react"
import { useDispatch, useSelector } from "@store"
import { memo, useCallback, useMemo } from "react"
import { Parameter, toggleParamSelected } from "@/redux/parametersSlice"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { FlexCenter } from "@/components/layout"

type AvailabiliyHoverCardProps = {
    children: React.ReactNode,
    available: boolean,
    open?: boolean
}

const AvailabiliyHoverCard = memo(({ children, available, open }: AvailabiliyHoverCardProps) => {
    const title = available ? "Available" : "Unavailable"
    const titleClass = available ? "text-green-600" : "text-red-600"
    const content = available
        ? "This parameter is available for selection and visualization."
        : "This parameter is not currently available, and cannot be selected."
    return (
        <HoverCard defaultOpen={!!open}>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
                <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                        <h4 className={"text-sm font-semibold " + titleClass} >{title}</h4>
                        <p className="text-sm">
                            {content}
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
})

type ParameterTableProps = {
    params: Parameter[],
    onToggleParam: (param: Parameter) => void
}
const DumbParameterTable = memo(({ params, onToggleParam }: ParameterTableProps) => {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="hidden md:table-cell">Parameter ID</TableHead>
                    <TableHead>Parameter Name</TableHead>
                    <TableHead>Units</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="p-0">
                {params.map((param) => {
                    const marker = param.status
                        ? <Check className="text-green-600 mr-1" />
                        : param.status === null
                            ? <CircleHelp className="text-gray-600 mr-1" />
                            : <X className="text-red-600 mr-1" />

                    let rowClass = param.selected
                        ? "text-green-700 dark:text-green-400 bg-green-200 dark:bg-green-900 cursor-pointer "
                        : "cursor-pointer "

                    const textClass = param.status === false
                        ? "text-red-300 dark:text-red-900"
                        : ""

                    if (!param.status) rowClass += textClass
                    return (
                        <TableRow key={param.id} className={rowClass} onClick={() => onToggleParam(param)}>
                            <TableCell className="p-0 pl-2">
                                <AvailabiliyHoverCard available={!!param.status}>
                                    {marker}
                                </AvailabiliyHoverCard>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{param.id}</TableCell>
                            <TableCell><Button className={"p-0 m-0 " + "bg-transparent" + textClass} variant="link" size="sm" disabled={!param.status} onClick={(e) => { onToggleParam(param); e.stopPropagation() }}>{param.name}</Button></TableCell>
                            <TableCell>{param.units}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
})

type InfoTextProps = {
    text: string,
    icon?: React.ReactNode
}
const InfoText = ({ text, icon }: InfoTextProps) => {
    return (
        <div className="mt-5">
            <FlexCenter direction="row">
                <span className="flex gap-2">
                    {icon} {text}
                </span>
            </FlexCenter>
        </div>
    )
}

export const ParameterTable = () => {
    const dispatch = useDispatch()
    const parameters = useSelector((state) => state.vars.params)
    const filterText = useSelector((state) => state.paramfilter.filterText)

    const toggleParam = useCallback((param: Parameter) => {
        if (!param.status) return
        dispatch(toggleParamSelected({ id: param.id }))
    }, [dispatch, toggleParamSelected])

    const filteredParameters = useMemo(() => {
        return (
            parameters.filter((param) => {
                return (
                    param.name.toLowerCase().includes(filterText.toLowerCase())
                    || param.id.toString().toLowerCase().includes(filterText.toLowerCase())
                )
            })
        )
    }, [parameters, filterText])

    if (!filteredParameters.length) {
        return <InfoText icon={<Info className="text-orange-500" />} text="No parameters match the filter criteria." />
    }

    if (!parameters.filter((param) => param.status).length) {
        return <InfoText icon={<OctagonX className="text-destructive" />} text="No parameters are available for selection." />
    }

    return <DumbParameterTable params={filteredParameters} onToggleParam={toggleParam} />
}

export const testComponents = {
    AvailabiliyHoverCard,
    DumbParameterTable
}