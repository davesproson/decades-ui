import { useDispatch } from "../redux/store"
import { setFilterText } from "../redux/filterSlice"
import { Input } from "../components/forms"
import { memo, useCallback } from "react"


interface ParameterSearchInputProps {
    filterText: string
}
/**
 * Provides a text input for filtering the parameters. 
 * Dispatches the setFilterText action.
 * 
 * @component
 * @example
 * const paramName = "paramName"
 * return (
 *  <ParameterSearchInput filterText={paramName} />
 * )
 */
const ParameterSearchInput = memo((props: ParameterSearchInputProps) => {
    const dispatch = useDispatch()

    const setFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilterText({filterText: e.target.value}))
    }, [dispatch, setFilterText, props.filterText])

    return (
        <div style={{marginBottom: ".5em"}}>
            <Input.Primary
                type="text"
                placeholder="Filter..."
                onChange={setFilter}
                value={props.filterText}
            />
        </div>
    )
})

export { ParameterSearchInput }