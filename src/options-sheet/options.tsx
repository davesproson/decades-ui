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

const OptionsSheet = () => {
    const isOpen = useSelector((state) => state.config.showOptionsDrawer)
    const dispatch = useDispatch()
    const setIsOpen = () => {
        dispatch(toggleOptionsDrawer())
    }
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle> Global Options</SheetTitle>
                <ThemeSelect />
                <Separator className="my-4"/>
                <ChatSwitch />
                <Separator className="my-4"/>
                <ParamSetSelector />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export { OptionsSheet }