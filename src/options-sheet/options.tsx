import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

import { useDispatch, useSelector } from "../redux/store"
import { toggleOptionsDrawer } from "@/redux/configSlice"
import { ThemeSelect } from "./theme-select"
import { ChatSwitch } from "./chat-enable"
import { Separator } from "@/components/ui/separator"
import { ParamSetSelector } from "./paramset-select"
import { LiveDataOnly } from "@/quicklook"
import { QuicklookSwitch } from "./quicklook-select"

const OptionsSheet = () => {
    const isOpen = useSelector((state) => state.config.showOptionsDrawer)
    const dispatch = useDispatch()
    const setIsOpen = () => {
        dispatch(toggleOptionsDrawer())
    }
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent>
                <SheetHeader className="mb-4">
                    <SheetTitle> Global Options</SheetTitle>
                </SheetHeader>

                    <ThemeSelect />

                    <Separator className="my-4" />
                    <QuicklookSwitch />

                    
                    <LiveDataOnly>
                        <Separator className="my-4" />
                        <ChatSwitch />
                    </LiveDataOnly>

                    <LiveDataOnly>
                        <Separator className="my-4" />
                        <ParamSetSelector />
                    </LiveDataOnly>


            </SheetContent>
        </Sheet>
    )
}

export { OptionsSheet }