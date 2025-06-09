import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { selectParamsByRawName } from "@/redux/parametersSlice"
import { useSelector } from "@/redux/store"
import { useDispatch } from "react-redux"

const MapParamSelector = () => {
    const parameters = useSelector(state => state.vars.params)
    const dispatch = useDispatch()
    const nSelectedParams = useSelector(state => state.vars.params).filter(param => param.selected).length

    return (
        <div className="fixed top-12 left-4 z-50">
            <Select onValueChange={(param) => {
                dispatch(selectParamsByRawName([param]))
            }} value={nSelectedParams === 1 ? parameters.find(param => param.selected)?.raw : ""}>
                <SelectTrigger className="w-full mr-2" >
                    <SelectValue placeholder="Select a parameter" />
                </SelectTrigger>
                <SelectContent>
                    {
                        parameters.map((param, i) => {
                            return (
                                <SelectItem key={i} value={param.raw}>
                                    {param.name}
                                </SelectItem>
                            )
                        })
                    }
                </SelectContent>
            </Select>
        </div >
    )
}

export { MapParamSelector }