import { ChatWidget } from "../../chat/chat"
import { enableChat } from "../../settings"
import { ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./types"
import chatIcon from "@/assets/view-icons/chat.svg"

const ChatConfig = () => {
    return (
        <div className="mt-2">
            Add a chat window to a view.
        </div>
    )
}

const useChatWidget = (registry: RegistryType<WidgetConfiguration>) => {
    if(!enableChat) return
    registry.register({
        name: "Chat",
        type: "chat",
        configComponent: <ChatConfig />,
        save: (props: ConfigWidgetProps) => {
            props.setData({
                type: "chat",
            })
            return true
        },
        icon: chatIcon,
        tooltip: 'Display a chat window',
        component: ChatWidget
    })
}

export { useChatWidget }