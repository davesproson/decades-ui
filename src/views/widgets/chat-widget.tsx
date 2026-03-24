import { ChatWidget } from "../../chat/chat"
import { enableChat } from "../../settings"
import { ConfigWidgetProps, WidgetConfiguration } from "./types"
import chatIcon from "@/assets/view-icons/chat.svg"

const ChatConfig = () => {
    return (
        <div className="mt-2">
            Add a chat window to a view.
        </div>
    )
}

// enableChat is a build-time constant — the conditional is resolved at
// compile time and the unused branch is tree-shaken.
export const chatWidgetConfig: WidgetConfiguration | null = enableChat
    ? {
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
    }
    : null
