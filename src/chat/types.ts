export type ChatProps = {
    embedded?: boolean
}

export type ChatUser = {
    username: string,
    id: string,
    regState: true | false | null
}

export type ChatConfig = {
    chatActive: boolean,
    chatNotify: boolean
}

export type ChatContextType = {
    state: {
        messages: Array<IncomingChatMessage>,
        connectionStatus: string,
        user: ChatUser,
        config: ChatConfig
    },
    actions: {
        sendChat: (message: string) => void,
        register: (username: string, id?: string) => void,
        setUser: (user: ChatUser) => void,
        toggleChatEnabled: () => void,
        toggleChatNotify: () => void
    }
}

export type OutgoingChatMessage = {
    type: "message",
    username: string,
    userid: string,
    message: string,
    time: number,
}

export type HistoryMessage = {
    type: "history"
}

export type HeartbeatMessage = {
    type: "heartbeat"
}

export type RegisterMessage = {
    type: "register",
    username: string,
    id?: string
}

export type Message = OutgoingChatMessage | HistoryMessage | HeartbeatMessage | RegisterMessage

export type IncomingChatMessage = {
    type: "message",
    username: string,
    message: string,
    userid: string,
    messageid: string,
    time: number
}

export type RegisterMessageResponse = {
    type: "register",
    username: string,
    id: string | null
}

export type HistoryMessageResponse = {
    type: "history"
    messages: Array<IncomingChatMessage>
}

export type HeartbeatMessageResponse = {
    type: "heartbeat"
}

export type MessageResponse = IncomingChatMessage
    | HistoryMessageResponse
    | HeartbeatMessageResponse
    | RegisterMessageResponse