import { useEffect, useRef, useState } from "react"
import { ChatConfig, ChatMessage, ChatMessageResponse, ChatUser, HistoryMessageResponse, MessageResponse, RegisterMessageResponse } from "./types"
import { useLocalStorage } from "usehooks-ts"
import { useDarkMode } from "../hooks"
import { base } from "../settings"
import { toast } from "react-toastify"

export const useScrollIntoView = (deps: any[]) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [ref.current, ...deps])
    return ref
}

export const useChatUser = (initialUser: ChatUser | null) => {
    if(!initialUser) initialUser = { username: '', id: '', regState: null }
    const [user, setUser] = useLocalStorage<ChatUser>('VistaChatUser', initialUser)

    return [user, setUser] as const
}

export const useChatConfig = () => {
    const [config, setConfig] = useLocalStorage<ChatConfig>('VistaChatConfig', {
        chatActive: false,
        chatNotify: false
    })

    return [config, setConfig] as const
}

const buildMessage = (message: ChatMessage) => {
    return `${message.username}: ${message.message}`
}

export const useMessageHandler = (lastMessage: MessageEvent<any> | null) => {
    const [messages, setMessages] = useState<Array<ChatMessageResponse>>([])
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [darkMode, _setDarkMode] = useDarkMode()
    const [_user, setUser] = useChatUser(null)
    const [config, _setConfig] = useChatConfig()

    useEffect(() => {
        if (lastMessage !== null) {
            const parsedMessage = JSON.parse(lastMessage.data) as MessageResponse

            if (parsedMessage.type === "message") {
                setMessages([...messages, parsedMessage])
                setToastMessage(buildMessage(parsedMessage))
            }

            if (parsedMessage.type === "history") {
                const history = JSON.parse(lastMessage.data) as HistoryMessageResponse
                setMessages(history.messages)
            }

            if (parsedMessage.type === "register") {
                const registeredInfo = JSON.parse(lastMessage.data) as RegisterMessageResponse
                const userId = registeredInfo.id || ''
                const regState = registeredInfo.id ? true : null
                setUser({
                    username: registeredInfo.username,
                    id:  userId,
                    regState: regState
                })
            }
        }
    }, [lastMessage])

    useEffect(() => {
        if(!config.chatNotify) {
            setToastMessage(null)
            return
        }
        if(document.hidden) {
            setToastMessage(null)
            return
        }
        if (window.location.pathname === `${base}chat`) {
            setToastMessage(null)
            return
        }
        if (toastMessage !== null) {
            toast(toastMessage, {
                theme: darkMode ? 'dark' : 'light'
            })
            setToastMessage(null)
        }
    }, [toastMessage, config])

    useEffect(() => {
        if(!config.chatActive) {
            setMessages([])
        }
    }, [config.chatActive])


    return messages
}