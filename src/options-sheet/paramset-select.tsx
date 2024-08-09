import { setParamSet, setParamsDispatched } from "@/redux/parametersSlice";
import { useDispatch, useSelector } from "@store";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "@/components/ui/select"

// TODO: Should get these from the server
const PARAMETER_SETS = [{
    name: "Default",
    paramset: "default"
}, {
    name: "Core Chem. Housekeeping",
    paramset: "corechem"
}]

export const ParamSetSelector = () => {
    const dispatch = useDispatch();
    const paramSet = useSelector(state => state.vars.paramSet);

    return (
        <Select value={paramSet || "default"} onValueChange={(x)=>{
            const serverParamSet = x === "default" ? "" : x
            dispatch(setParamSet(serverParamSet))
            dispatch(setParamsDispatched(false))
        }}>
            <SelectTrigger className="w-full mr-2" >
                Select Parameter Set...
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                    <SelectLabel>Parameter Set</SelectLabel>
                    {PARAMETER_SETS.map((set, i) => (
                        <SelectItem
                            key={i}
                            value={set.paramset}
                        >
                            {set.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export const testConstants = {
    PARAMETER_SETS
}