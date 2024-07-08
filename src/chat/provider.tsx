/**
 * This module provides a provider for the chat context. The chat context
 * wraps the majority of the application, providing a chat server connection
 * and chat message handling. This allows chat notifications and messages
 * to be displayed at any point in the application.
 */

import React, { createContext } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { apiEndpoints } from "../settings";
import { useChatConfig, useChatUser, useMessageHandler } from "./hooks";
import { ChatContextType, OutgoingChatMessage, RegisterMessage } from "./types";
import { ChatDispatch } from "./chat";
import { base } from "../settings";

/**
 * Create a context for chat.
 */
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
    // Placeholder action functions for the context
    actions: {
        sendChat: () => { },
        register: () => { },
        setUser: () => { },
        toggleChatEnabled: () => { },
        toggleChatNotify: () => { }
    }
});

/**
 * Create a provider for the ChatContext.
 * 
 * @param props - the component properties
 * @param props.children - the children to wrap in the provider
 * 
 * @returns the provider
 */
const ChatProvider = (props: { children: React.ReactNode }) => {
    const [user, setUser] = useChatUser({
        username: '',
        id: '',
        regState: false
    })
    const [config, setConfig] = useChatConfig()

    // Determine the websocket address
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const wsAddress = `${wsProtocol}://${window.location.host}${apiEndpoints.chat}`

    // Create a websocket connection to the chat server.
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        wsAddress, 
        {
            retryOnError: true,
            onError: (e) => console.error(e),
            onOpen: () => {
                // Request the chat history when the connection is opened
                sendMessage(JSON.stringify({ type: "history" }))
                console.log('Connected to chat server')
            },
            onClose: (e) => {
                console.log('Disconnected from chat server')
                if (e.code === 4001) {
                    // The server closes the websocket connection with a 4001
                    // status code when the user is not authenticated and the
                    // server is configured to require authentication.
                    // In this case, disable chat and redirect to the login page.
                    if(state.config.chatActive) {
                        actions.toggleChatEnabled()
                    }
                    window.location.href = `${apiEndpoints.login}?next=${base}`
                }
            }
        },
        config.chatActive
    );

    const messages = useMessageHandler(lastMessage)

    /**
     * Register a user with the chat server. 
     * 
     * @param username - the username to register
     * @param id - the user id to register, if the user is already registered.
     *             If a username and id are provided, the id must match the
     *             server's id for the user.
     * @returns 
     */
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

    /**
     * Send a chat message to the chat server.
     * 
     * @param message - the message to send
     */
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

    // Human readable connection status
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    // Initialize the chat context state
    const state = {
        messages,
        connectionStatus,
        user,
        config
    }

    // Initialize the chat context actions
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
