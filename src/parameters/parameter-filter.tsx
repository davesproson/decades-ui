import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { setFilterText } from "@/redux/filterSlice"
import { resetParameterStatuses, setParams, unselectAllParams } from "@/redux/parametersSlice"
import { useDispatch, useSelector } from "@/redux/store"
import { memo, useCallback, useEffect, useState } from "react"
import { RefreshCw } from 'lucide-react'
import { useParameterEndpoint } from "./hooks"
import { quickLookCompatability } from "@/quicklook/utils"
import { authFetch as fetch } from "@/utils"

type ParameterRefreshButtonProps = {
    enabled: boolean,
    spin: boolean,
    onClick: () => void
}
const ParameterRefreshButton = ({ enabled, spin, onClick }: ParameterRefreshButtonProps) => {
    return (
        <Button variant="outline" disabled={!enabled} onClick={onClick}>
            <RefreshCw className={`${spin && "animate-spin"}`} />
        </Button>
    )
}

type ParameterFilterInputBoxProps = {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const ParameterFilterInputBox = ({ value, onChange }: ParameterFilterInputBoxProps) => {
    return (
        <Input className="align-middle"
            placeholder="Filter parameters..."
            value={value}
            onChange={onChange}
            data-testid="parameter-text-input" />
    )
}

type ParameterTextClearButtonProps = {
    onClick: () => void
}
const ParameterTextClearButton = ({ onClick }: ParameterTextClearButtonProps) => {
    return (
        <Button variant="outline"
            className="ml-2 mr-2"
            onClick={onClick}
            data-testid="parameter-text-clear-button">
            Clear Selection
        </Button>
    )
}


export const ParameterFilter = memo(() => {
    const dispatch = useDispatch()
    const filterText = useSelector((state) => state.paramfilter.filterText)
    const parameterEndpoint = useParameterEndpoint(true)
    const quicklookMode = useSelector((state) => state.config.quickLookMode)
    const [spin, setSpin] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(0)
    const [enabled, setEnabled] = useState(true)

    useEffect(() => {
        if (lastUpdate === 0) return
        const timer = setTimeout(() => {
            setEnabled(true)
        }, 60000)
        return () => clearTimeout(timer)
    }, [lastUpdate, setEnabled])

    const setFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilterText({ filterText: e.target.value }))
    }, [dispatch, setFilterText, filterText])

    const clearSelection = useCallback(() => {
        dispatch(setFilterText({ filterText: "" }))
        dispatch(unselectAllParams())
    }, [dispatch, setFilterText, unselectAllParams])

    const reloadParams = useCallback(() => {
        setLastUpdate(Date.now())
        setEnabled(false)
        setSpin(true)
        dispatch(resetParameterStatuses())

        fetch(parameterEndpoint).then((response) => {
            if (response.ok) {
                return response.json()
            }

            throw new Error("Failed to fetch parameter availability")
        }).then((data) => {
            const cData = quickLookCompatability(quicklookMode)(data)
            dispatch(setParams(cData))
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            setSpin(false)
        })
    }, [dispatch, setParams, parameterEndpoint, quicklookMode, resetParameterStatuses, quickLookCompatability, setSpin, setLastUpdate, setEnabled])

    return (
        <div className="flex">
            <ParameterFilterInputBox value={filterText} onChange={setFilter} />
            <ParameterTextClearButton onClick={clearSelection} />
            <ParameterRefreshButton enabled={enabled} spin={spin} onClick={reloadParams} />
        </div>
    )
})

export const testComponents = {
    ParameterRefreshButton,
    ParameterFilterInputBox,
    ParameterTextClearButton
}