import { useContext, useState } from 'react';
import { ChatContext } from './provider';
import { FlexCenter, Spacer, Splash } from '../components/layout';
import { Button } from '../components/buttons';
import { Tag } from '../components/tags';
import { useChatResizer, useRegisterChatUser, useScrollIntoView } from './hooks';
import { useScrollInhibitor } from '../hooks';
import { ChatUser } from './types';
import OptionSwitch from '../components/optionSwitch';

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

const ChatTime = (props: { time: number }) => {
    const date = new Date(props.time)
    return <span>{date.toLocaleTimeString()}</span>
}


type ChatProps = {
    embedded?: boolean
}

const Chat = (props: ChatProps) => {

    const { state, actions } = useContext(ChatContext);
    const [messageText, setMessageText] = useState('')
    const { rect, containerRef } = useChatResizer(!!props.embedded)
    const chatRef = useScrollIntoView([state.messages])
    useRegisterChatUser()
    useScrollInhibitor(true)
    
    const sendMessage = () => {
        if (!messageText) return
        actions.sendChat(messageText)
        setMessageText('')
    }

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    if (!state.config.chatActive) return <ChatNotOn />

    const standaloneStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        top: "40px"
    }

    const embeddedStyle: React.CSSProperties = {
        position: "relative",
        height: rect?.height,
    }

    const extraStyle = props.embedded ? embeddedStyle : standaloneStyle

    const ChatContainer = (
        <FlexCenter direction="column" extraStyle={extraStyle}>
            <div className="is-flex is-flex-grow-1 is-flex-direction-column" style={{ justifyContent: "left", width: "100%", padding: "20px", overflow: "auto" }}>
                {state.messages.map(message => {

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
                            {message.message}
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


    return (
        <div ref={containerRef} style={extraStyle}>
            {(rect || !props.embedded) ? ChatContainer : null}
        </div>
    );
}

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

export const ChatRegistration = () => {
    useScrollInhibitor(true)
    const { actions, state } = useContext(ChatContext);
    const [username, setUsername] = useState(state.user.username)

    const register = () => {
        if (!username) return
        if (username === state.user.username)
            actions.register(username, state.user.id)
        else
            actions.register(username)

    }

    if (!state.config.chatActive) return null

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

export const ChatDispatch = (props: { children: React.ReactNode }) => {
    const { state } = useContext(ChatContext);
    if (state.user.regState || !state.config.chatActive) return <>{props.children}</>
    return <ChatRegistration />
}

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

export const ChatWidget = () => {
    return <Chat embedded />
}

export default Chat;