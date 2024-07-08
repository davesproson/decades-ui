import { useContext, useState } from 'react';
import { ChatContext } from './provider';
import { FlexCenter, Spacer, Splash } from '../components/layout';
import { Button } from '../components/buttons';
import { Tag } from '../components/tags';
import { useChatResizer, useRegisterChatUser, useScrollIntoView } from './hooks';
import { useScrollInhibitor } from '../hooks';
import { ChatUser, ChatProps } from './types';
import OptionSwitch from '../components/optionSwitch';

/**
 * A component to display a message when chat is selected but not enabled.
 * 
 */
const ChatNotOn = () => {
    const { actions } = useContext(ChatContext);

    return (
        <Splash>
            <div className="is-flex is-flex-direction-column is-align-items-center">
                <h1 className="title">Enable Chat?</h1>
                <Button.Info fullWidth onClick={actions.toggleChatEnabled}>Enable</Button.Info>
            </div>
        </Splash>
    )
}

/**
 * A component to display the time of a chat message.
 * 
 * @param props - the component properties
 * @param props.time - the time of the message in milliseconds since epoch
 */
const ChatTime = (props: { time: number }) => {
    const date = new Date(props.time)
    return <span>{date.toLocaleTimeString()}</span>
}

/**
 * The main chat component.
 * 
 * @param props - the component properties
 * @param props.embedded - whether the chat is embedded in a view
 * @returns 
 */
const Chat = (props: ChatProps) => {

    const { state, actions } = useContext(ChatContext);
    const [messageText, setMessageText] = useState('')
    const { rect, containerRef } = useChatResizer(!!props.embedded)
    const chatRef = useScrollIntoView([state.messages])
    useRegisterChatUser()
    useScrollInhibitor(true)
    
    // Send a chat message using the current message text, via an action
    // on the chat context.
    const sendMessage = () => {
        if (!messageText) return
        actions.sendChat(messageText)
        setMessageText('')
    }

    // Handle the enter key to send a message.
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    // If chat is not active, return early with a component indicating
    // that chat is not enabled.
    if (!state.config.chatActive) return <ChatNotOn />

    // Styles for the chat container, depending on whether the chat is
    // embedded or standalone.
    // The standalone style is positioned absolutely to fill the screen,
    // with a top margin for the header.
    // The embedded style is positioned relatively to fit the parent
    // container.
    const standaloneStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        top: "40px"
    }

    const embeddedStyle: React.CSSProperties = {
        position: "relative",
        height: rect?.height,
    }

    // The extra style to apply to the chat container, depending on whether
    // the chat is embedded or standalone.
    const extraStyle = props.embedded ? embeddedStyle : standaloneStyle

    // The chat container component, which displays the chat messages and
    // input field.
    const ChatContainer = (
        <FlexCenter direction="column" extraStyle={extraStyle}>
            <div className="is-flex is-flex-grow-1 is-flex-direction-column" style={{ justifyContent: "left", width: "100%", padding: "20px", overflow: "auto" }}>
                {state.messages.map(message => {

                    let messageText: string = message.message
                    let messageUrl: string = ''
                    const rex = /(https?:\/\/[^ ]*)/
                    const matched = message.message.match(rex)
                    if (matched) {
                        const url = matched[0]
                        messageUrl = url
                        messageText = message.message.replace(url, '')
                    }

                    const MessageUrlComponent = () => {
                        return (
                            <a target='_blank' rel='noreferrer' href={messageUrl}>Link</a>
                        )
                    }

                    const tagText = message.username === state.user.username
                        ? 'You'
                        : message.username

                    const tagType = message.username === state.user.username
                        ? 'success'
                        : 'info'

                    return (
                        <div key={message.messageid}>
                            <span className="mr-2"><ChatTime time={message.time} /></span>
                            <Tag is={tagType} text={tagText} extraClasses='mr-2 mb-1' />
                            {messageText} <MessageUrlComponent />
                        </div>
                    )
                })}
                <div ref={chatRef} />
            </div>

            <div className="is-flex is-flex-direction-row" style={{ width: "100%", padding: "10px" }}>
                <div className="is-flex is-flex-grow-1" >
                    <input className="input is-secondary mr-1" type="text" style={{ width: "100%" }} value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleEnter} />
                </div>

                <div className="is-flex">
                    <Button.Secondary outlined onClick={sendMessage}>
                        Send
                    </Button.Secondary>
                </div>
            </div>
        </FlexCenter >
    )

    // Return the chat component with the chat container, or null if the
    // chat is embedded and the container is not yet sized.
    return (
        <div ref={containerRef} style={extraStyle}>
            {(rect || !props.embedded) ? ChatContainer : null}
        </div>
    );
}

/**
 * A component to display a message when chat registration fails.
 * 
 * @param props - the component properties
 * @param props.user - the chat user
 * 
 * @returns the component
 */
const FailedRegistration = (props: { user: ChatUser }) => {
    if (props.user.regState !== null) return null
    return (
        <article className="message is-danger">
            <div className="message-body">
                Failed to register user, try with a different username
            </div>
        </article>
    )
}

/**
 * A component to display a message when chat registration is required.
 * 
 */
export const ChatRegistration = () => {
    useScrollInhibitor(true)
    const { actions, state } = useContext(ChatContext);
    const [username, setUsername] = useState(state.user.username)

    // A callback to register the chat user.
    const register = () => {
        if (!username) return
        if (username === state.user.username)
            // We have a user, and a server provided id, so we can register
            // an existing user assuming these match on the server.
            actions.register(username, state.user.id)
        else
            // We have a user, but no server id, so we can register a new user.
            actions.register(username)

    }

    // If chat is not active, return early with null.
    if (!state.config.chatActive) return null

    // Return the chat registration component.
    return (
        <Splash>
            <div className="is-flex is-flex-direction-column is-align-items-center">
                <h1 className="title">Chat Registration</h1>
                <FailedRegistration user={state.user} />
                <p>Enter your username to join the chat</p>
                <input type="text" className="input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <Spacer size={5} />
                <Button.Info fullWidth onClick={register}>Join Chat</Button.Info>
                <Button fullWidth extraClasses="mt-2" onClick={actions.toggleChatEnabled}>Cancel</Button>
            </div>
        </Splash>
    )
}

/**
 * A parent component which wraps displays its children only if chat is
 * enabled and the user is registered, otherwise it displays the chat
 * registration component.
 *
 * @param props - the component properties
 * @param props.children - the children to display if chat is enabled and
 *                         the user is registered
 *
 * @returns the component
 */
export const ChatDispatch = (props: { children: React.ReactNode }) => {
    const { state } = useContext(ChatContext);
    if (state.user.regState || !state.config.chatActive) return <>{props.children}</>
    return <ChatRegistration />
}

/**
 * A component to display the chat configuration switch, used to enable or
 * disable chat and to toggle chat notifications.
 * 
 * Chat notifications are toasts that appear when a new chat message is
 * received and the user is not currently viewing the chat.
 *
 * @returns the component
 */
export const ChatConfigSwitch = () => {
    const { state, actions } = useContext(ChatContext);

    const buttonType = state.config.chatNotify
        ? "success"
        : ''

    const toggleNotify = () => {
        actions.toggleChatNotify()
    }

    return (
        <>
            <OptionSwitch
                value={state.config.chatActive ? "On" : "Off"}
                options={["On", "Off"]}
                toggle={() => {
                    actions.toggleChatEnabled()
                    return { type: "chatEnabled", value: null }
                }}
                useStore={false} 
                small
            />
            <Button small kind={buttonType} onClick={toggleNotify}>Notify</Button>
        </>
    )
}

/**
 * A chat widget component, which displays the chat in an embedded view.
 *
 * @returns the component
 */
export const ChatWidget = () => {
    return <Chat embedded />
}

export default Chat;