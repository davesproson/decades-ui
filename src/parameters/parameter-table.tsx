import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import { Check, X, CircleHelp } from "lucide-react"
import { useDispatch, useSelector } from "@store"
import { memo, useCallback, useMemo } from "react"
import { Parameter, toggleParamSelected } from "@/redux/parametersSlice"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useDispatchParameters } from "@/hooks"

type AvailabiliyHoverCardProps = {
    children: React.ReactNode,
    available: boolean
}

const AvailabiliyHoverCard = memo(({ children, available }: AvailabiliyHoverCardProps) => {
    const title = available ? "Available" : "Unavailable"
    const titleClass = available ? "text-green-600" : "text-red-600"
    const content = available
        ? "This parameter is available for selection and visualization."
        : "This parameter is not currently available, and cannot be selected."
    return (
        <HoverCard>
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

const ParameterTable = memo(() => {
    useDispatchParameters()
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
                {filteredParameters.map((param) => {
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
                        <TableRow key={param.id} className={rowClass} onMouseDown={() => toggleParam(param)}>
                            <TableCell className="p-0 pl-2">
                                <AvailabiliyHoverCard available={!!param.status}>
                                    {marker}
                                </AvailabiliyHoverCard>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{param.id}</TableCell>
                            <TableCell><Button className={"p-0 m-0 " + "bg-transparent" + textClass} variant="link" size="sm" disabled={!param.status}>{param.name}</Button></TableCell>
                            <TableCell>{param.units}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
})

export { ParameterTable }