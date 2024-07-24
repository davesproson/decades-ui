import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { setQuickLookMode } from "@/redux/configSlice"
import { setParamsDispatched } from "@/redux/parametersSlice"
import { useSelector, useDispatch } from "@/redux/store"

export const QuicklookSwitch = () => {

    const dispatch = useDispatch()
    const quicklookMode = useSelector(state => state.config.quickLookMode)
    const toggleQuicklookMode = () => {
        dispatch(setParamsDispatched(false))
        dispatch(setQuickLookMode(!quicklookMode))
    }

    return (
        <div className="flex items-center space-x-2 mt-1">
            <Switch checked={quicklookMode} onCheckedChange={toggleQuicklookMode} id="enable-qc" />
            <Label htmlFor="enable-qc">Quicklook Mode</Label>
        </div>
    )
}