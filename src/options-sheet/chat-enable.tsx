import { useChatConfig } from "@/chat/hooks"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function ChatSwitch() {

    const [config, setConfig] = useChatConfig()

    const toggleChatEnabled = () => {
        setConfig(c => ({ ...c, chatActive: !c.chatActive }))
    }

    const toggleChatNotify = () => {
        setConfig(c => ({ ...c, chatNotify: !c.chatNotify }))
    }

    return (
        <div>
            <div className="flex items-center space-x-2 mt-1">
                <Switch checked={config.chatActive} onCheckedChange={toggleChatEnabled} id="enable-chat" />
                <Label htmlFor="enable-chat">Enable chat</Label>
            </div>
            <div className="flex items-center space-x-2 mt-1">
                <Switch checked={config.chatNotify} onCheckedChange={toggleChatNotify} id="enable-chat-notify" />
                <Label htmlFor="enable-chat-notify">Chat notify</Label>
            </div>
        </div>
    )
}