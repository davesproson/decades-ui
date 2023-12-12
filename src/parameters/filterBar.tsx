import { useDispatch } from "../redux/store"
import { setFilterText } from "../redux/filterSlice"
import { Input } from "../components/forms"


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
const ParameterSearchInput = (props: ParameterSearchInputProps) => {
    const dispatch = useDispatch()

    const setFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilterText({filterText: e.target.value}))
    }

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
}

export { ParameterSearchInput }