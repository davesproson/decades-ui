import React, { createContext } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { apiEndpoints } from "../settings";
import { useChatConfig, useChatUser, useMessageHandler } from "./hooks";
import { ChatContextType, OutgoingChatMessage, RegisterMessage } from "./types";
import { ChatDispatch } from "./chat";
import { base } from "../settings";


export const ChatContext = createContext<ChatContextType>({
    state: {
        messages: [],
        connectionStatus: '',
        user: {
            username: '',
            id: '',
            regState: false
        },
        config: {
            chatActive: false,
            chatNotify: false
        }
    },
    actions: {
        sendChat: () => { },
        register: () => { },
        setUser: () => { },
        toggleChatEnabled: () => { },
        toggleChatNotify: () => { }
    }
});


const ChatProvider = (props: { children: React.ReactNode }) => {
    const [user, setUser] = useChatUser({
        username: '',
        id: '',
        regState: false
    })
    const [config, setConfig] = useChatConfig()

    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const wsAddress = `${wsProtocol}://${window.location.host}${apiEndpoints.chat}`

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        wsAddress, {
        retryOnError: true,
        onError: (e) => console.error(e),
        onOpen: () => {
            sendMessage(JSON.stringify({ type: "history" }))
            console.log('Connected to chat server')
        },
        onClose: (e) => {
            console.log('Disconnected from chat server')
            const code = e.code
            if (code === 4001) {
                if(state.config.chatActive) {
                    actions.toggleChatEnabled()
                }
                window.location.href = `${apiEndpoints.login}?next=${base}`
            }
        }
    }, config.chatActive
    );



    const messages = useMessageHandler(lastMessage)

    const register = (username: string, id?: string | null) => {
        if (!username) return
        let message: RegisterMessage = {
            type: 'register',
            username: username
        }
        if (id) {
            message = {
                ...message,
                id: id
            }
        }

        sendMessage(JSON.stringify(message))
    }

    const sendChat = (message: string) => {
        if (!message || !config.chatActive) return

        const messageObject: OutgoingChatMessage = {
            type: 'message',
            username: user.username,
            userid: user.id,
            message: message,
            time: Date.now()
        }

        sendMessage(JSON.stringify(messageObject))
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const state = {
        messages,
        connectionStatus,
        user,
        config
    }

    const actions = {
        sendChat,
        register,
        setUser,
        toggleChatEnabled: () => {
            setConfig({
                chatActive: !config.chatActive,
                chatNotify: config.chatNotify
            })
            register(user.username, user.id)
        },
        toggleChatNotify: () => {
            setConfig({
                chatActive: config.chatActive,
                chatNotify: !config.chatNotify
            })
        }
    }

    return (
        <ChatContext.Provider value={{ state, actions }}>
            <ChatDispatch>
                {props.children}
            </ChatDispatch>
        </ChatContext.Provider>
    )
}

export default ChatProvider
