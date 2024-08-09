import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { setTabbedPlots } from "@/redux/configSlice"
import { useSelector, useDispatch } from "@/redux/store"

export const TabbedPlotsSwitch = () => {

    const dispatch = useDispatch()
    const tabbedPlots = useSelector(state => state.config.tabbedPlots)
    const toggleTabbedPlots = () => {
        dispatch(setTabbedPlots(!tabbedPlots))
    }

    return (
        <div className="flex items-center space-x-2 mt-1">
            <Switch checked={tabbedPlots} onCheckedChange={toggleTabbedPlots} id="enable-tabs" />
            <Label htmlFor="enable-tabs">Tabbed Plots</Label>
        </div>
    )
}