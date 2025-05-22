import { useContext, useEffect, useRef, useState } from "react"
import { ChatConfig, IncomingChatMessage, ChatUser, MessageResponse } from "./types"
import { useLocalStorage } from "usehooks-ts"
import { base } from "../settings"
import { useToast } from "@/components/ui/use-toast"
import { ChatContext } from "./provider"

/**
 * A hook which scrolls a ref into view.
 * 
 * @param deps - the dependencies to trigger a scroll
 * @returns 
 */
export const useScrollIntoView = (deps: any[]) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [ref.current, ...deps])
    return ref
}

/**
 * A hook to manage the chat user in local storage.
 * 
 * @param initialUser - the initial user
 * @returns the user and a function to set the user
 */
export const useChatUser = (initialUser: ChatUser | null) => {
    if (!initialUser) initialUser = { username: '', id: '', regState: null }
    const [user, setUser] = useLocalStorage<ChatUser>('VistaChatUser', initialUser)

    return [user, setUser] as const
}

/**
 * A hook to manage the chat configuration in local storage. The configuration
 * includes whether the chat is active, and whether to notify the user of new
 * messages, in an object of type `ChatConfig`.
 * 
 * @returns the configuration and a function to set the configuration
 */
export const useChatConfig = () => {
    const [config, setConfig] = useLocalStorage<ChatConfig>('VistaChatConfig', {
        chatActive: false,
        chatNotify: false
    })

    return [config, setConfig] as const
}

/**
 * A hook to build a message from an incoming chat message.
 * 
 * @param message - the incoming chat message of type `IncomingChatMessage`
 * @returns the message
 */
const buildMessage = (message: IncomingChatMessage) => {
    return `${message.username}: ${message.message}`
}

/**
 * A hook to handle incoming chat messages.
 * 
 * @param lastMessage - the last message received
 * @returns an array of incoming chat messages
 */
export const useMessageHandler = (lastMessage: MessageEvent<any> | null) => {
    const [messages, setMessages] = useState<Array<IncomingChatMessage>>([])
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const { toast } = useToast()
    const [_user, setUser] = useChatUser(null)
    const [config, _setConfig] = useChatConfig()

    /**
     * An eddect that triggers when lastMessage changes. It parses the message
     * and updates the messages state. Last message is provided by the reactive
     * websocket hook.
     */
    useEffect(() => {
        if (lastMessage !== null) {
            const parsedMessage = JSON.parse(lastMessage.data) as MessageResponse

            // If the message is a chat message, add it to the messages array
            if (parsedMessage.type === "message") {
                setMessages([...messages, parsedMessage])
                setToastMessage(buildMessage(parsedMessage))
            }

            // If the message is a history message, set the messages array
            // The history message is sent when the user first connects
            if (parsedMessage.type === "history") {
                setMessages(parsedMessage.messages)
            }

            // If the message is a register message, set the user state
            if (parsedMessage.type === "register") {
                const userId = parsedMessage.id || ''
                const regState = parsedMessage.id ? true : null
                setUser({
                    username: parsedMessage.username,
                    id: userId,
                    regState: regState
                })
            }
        }
    }, [lastMessage])

    /**
     * An effect that triggers when the chatNotify configuration changes. If
     * chatNotify is true, the user is not on the chat page, and the document
     * is not hidden, a toast notification is shown.
     */
    useEffect(() => {

        // If chatNotify is false, clear the toast message
        if (!config.chatNotify) {
            setToastMessage(null)
            return
        }

        // If the document is hidden, clear the toast message
        if (document.hidden) {
            setToastMessage(null)
            return
        }

        // If the user is on the chat page, clear the toast message
        if (window.location.pathname === `${base}chat`) {
            setToastMessage(null)
            return
        }

        // If the chatNotify is true, the user is not on the chat page, and the
        // document is not hidden, show the toast message
        if (toastMessage !== null) {
            toast({
                title: "New message",
                description: toastMessage,
                color: 'success',
                duration: 5000,
            })
            setToastMessage(null)
        }
    }, [toastMessage, config])

    useEffect(() => {
        if (!config.chatActive) {
            setMessages([])
        }
    }, [config.chatActive])


    return messages
}

/**
 * A hook that actively manages the resizing of the chat window.
 * We need to do this actively because... reasons.
 * 
 * @param embedded - whether the chat is embedded in a view
 * @returns an object with the rect and containerRef
 */
export const useChatResizer = (embedded: boolean) => {
    const [rect, setRect] = useState<DOMRect | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    /**
     * An effect that triggers when the containerRef or bounding rect changes.
     * If the containerRef is not null, and the bounding rect is not set, set
     * the bounding rect.
     */
    useEffect(() => {
        if (!embedded || rect) return

        const containerSize = containerRef.current?.getBoundingClientRect()

        if (!containerSize) return

        setRect(containerSize)
    }, [containerRef.current, rect])

    /**
     * A effect which adds a listener to the window resize event if the
     * chat is embedded and thus needs to be actively resized.
     */
    useEffect(() => {
        if (!embedded) return
        const listener = () => setRect(null)
        // Unset the rect when the window resizes
        window.addEventListener('resize', listener)

        // Cleanup
        return () => window.removeEventListener('resize', listener)
    }, [])

    return { rect, containerRef }
}

/**
 * A hook to register the chat user.
 */
export const useRegisterChatUser = () => {
    const { state, actions } = useContext(ChatContext);
    useEffect(() => {
        actions.register(state.user.username, state.user.id)
    }, [])
}