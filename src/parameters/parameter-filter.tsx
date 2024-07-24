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

const ParameterFilter = memo(() => {
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
        dispatch(setFilterText({filterText: e.target.value}))
    }, [dispatch, setFilterText, filterText])

    const clearSelection = useCallback(() => {
        dispatch(setFilterText({filterText: ""}))
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
            <Input className="align-middle" 
                   placeholder="Filter parameters..." 
                   value={filterText} 
                   onChange={e=>setFilter(e)} />
            <Button variant="outline" 
                    className="ml-2 mr-2"
                    onClick={clearSelection}>
                Clear Selection
            </Button>
            <Button variant="outline" disabled={!enabled} onClick={reloadParams}>
                <RefreshCw className={`${spin && "animate-spin"}`} />
            </Button>
        </div>
    )
})

export { ParameterFilter }