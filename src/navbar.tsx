import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { useDispatch, useSelector } from "@store"
import { toggleOptionsDrawer } from "@/redux/configSlice"
import { setTimeframe } from "@/redux/optionsSlice"
import { useNavigate } from "@tanstack/react-router"
import { useGeoCoords, useParameterPresets } from "@/hooks"
import { selectParamsByRawName } from "./redux/parametersSlice"
import { LiveDataOnly } from "./quicklook"
import { loadSavedView } from "./redux/viewSlice"
import { Home } from "lucide-react"
import { cn } from "./lib/utils"
import { useTephiAvailable, useTephiUrl } from "./tephigram/hooks"
import { usePlotUrl } from "./plot/hooks"
import { memo } from "react"
import { useDashboardUrl } from "./dashboard/hooks"

const launch = (url: string | undefined) => {
    if (url === undefined) return
    window.open(url, "_blank")
}

const Navbar = memo(({ children, className, fixedWidth }: { children: React.ReactNode, className?: string, fixedWidth?: boolean }) => {
    const dispatch = useDispatch()
    const geoCoords = useGeoCoords()

    const timeframes = useSelector((state) => state.options.timeframes)
    const savedViews = useSelector((state) => state.view.savedViews)
    const useCustomTimeframe = useSelector((state) => state.options.useCustomTimeframe)
    const nSelectedParams = useSelector((state) => state.vars.params).filter((param) => param.selected).length

    const presets = useParameterPresets()
    const navigate = useNavigate()

    const tephiAvailable = useTephiAvailable()
    const tephiUrl = useTephiUrl()
    const plotUrl = usePlotUrl()
    const dashUrl = useDashboardUrl()
    const latUrl = usePlotUrl({ "ordvar": geoCoords.latitude, swapxy: true })
    const lonUrl = usePlotUrl({ "ordvar": geoCoords.longitude })
    const heightUrl = usePlotUrl({ "ordvar": geoCoords.altitude, swapxy: true })


    const fixWidth = (fixedWidth) || (fixedWidth === undefined)
    const outletClass = fixWidth ? "md:w-[80%] lg:w-[60%] min-w-[600px] m-auto mt-12" : "mt-12"

    const selectParameters = (rawNames: Array<string>) => {
        dispatch(selectParamsByRawName(rawNames))
    }

    const openViewAtConfig = (id: string) => {
        dispatch(loadSavedView({ id: id }))
        navigate({ to: "/view-config" })
    }

    return (
        <>
            <Menubar className="fixed left-0 right-0 top-0 bg-background z-10 rounded-none border-none">
                <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer" onClick={() => navigate({ to: "/" })}>
                        <Home />
                    </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Timeframe</MenubarTrigger>
                    <MenubarContent>
                        <LiveDataOnly>
                            {timeframes.map((timeframe) => (
                                <MenubarCheckboxItem key={timeframe.value} checked={timeframe.selected} onClick={() => dispatch(setTimeframe({ value: timeframe.value }))} className={timeframe.selected ? "text-green-600" : ""}>
                                    {timeframe.label}
                                </MenubarCheckboxItem>
                            ))}
                            <MenubarSeparator />
                        </LiveDataOnly>
                        <MenubarCheckboxItem onClick={() => navigate({ to: '/timeframe' })} checked={useCustomTimeframe} className={useCustomTimeframe ? "text-green-600" : ""}>
                            Custom...
                        </MenubarCheckboxItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Presets</MenubarTrigger>
                    <MenubarContent>
                        {Object.keys(presets).map((preset) => {
                            return (
                                <MenubarItem key={preset} onClick={() => selectParameters(presets[preset])}>
                                    {preset}
                                </MenubarItem>
                            )
                        })}
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Views</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={() => navigate({ to: "/view-config" })}>Configure...</MenubarItem>
                        <MenubarItem onClick={() => navigate({ to: '/view-library' })}>Library...</MenubarItem>
                        {savedViews.length > 0 && <MenubarSeparator />}
                        {savedViews.map((x, i) => {
                            return (
                                <MenubarItem key={i} onClick={() => openViewAtConfig(x.id as string)}>
                                    {x.name}
                                </MenubarItem>
                            )
                        })}
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>More</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={() => navigate({ to: "/map" })}>Map...</MenubarItem>
                        <MenubarItem onClick={() => navigate({ to: "/flight-summary" })}>Flight Summary...</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem onClick={() => navigate({ to: "/chat" })}>
                            Chat...
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Alarms...</MenubarItem>
                        <MenubarItem>Timers...</MenubarItem>
                        <MenubarItem>Gauges...</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Options</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={() => navigate({ to: '/plot-options' })}>Plot Options...</MenubarItem>
                        <MenubarItem onClick={() => dispatch(toggleOptionsDrawer())}>
                            Global Options...
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger className="text-green-600 focus:text-green-700 focus:bg-accent data-[state=open]:bg-accent data-[state=open]:text-green-700">
                        Launch!
                    </MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem disabled={!nSelectedParams} onClick={() => launch(plotUrl?.toString())}>
                            Plot
                        </MenubarItem>
                        <MenubarSub>
                            <MenubarSubTrigger>Earth coordinates</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem disabled={!nSelectedParams} onClick={() => launch(latUrl?.toString())}>vs latitude</MenubarItem>
                                <MenubarItem disabled={!nSelectedParams} onClick={() => launch(lonUrl?.toString())}>vs longitude</MenubarItem>
                                <MenubarItem disabled={!nSelectedParams} onClick={() => launch(heightUrl?.toString())}>vs altitude</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSeparator />
                        <MenubarItem disabled={!tephiAvailable} onClick={() => launch(tephiUrl)}>
                            Tephigram
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem disabled={!nSelectedParams} onClick={() => launch(dashUrl.toString())}>Dashboard</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <div className={cn(
                outletClass,
                className
            )}>
                {children}
            </div>
        </>
    )
})

export default Navbar
