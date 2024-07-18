import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useScrollInhibitor } from '@/hooks';
import { useContext, useState } from 'react';
import { useChatResizer, useRegisterChatUser, useScrollIntoView } from './hooks';
import { ChatContext } from './provider';
import { ChatProps, ChatUser } from './types';
import { Input } from '@/components/ui/input';
import { FlexCenter, Splash } from '@/components/layout';
import { CircleAlert, ExternalLink, SendHorizonal } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * A component to display a message when chat is selected but not enabled.
 * 
 */
const ChatNotOn = () => {
    const { actions } = useContext(ChatContext);

    return (
        <div className="absolute flex justify-center items-center inset-0">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold">Enable Chat?</h1>
                <Button className="mt-2 w-full" onClick={actions.toggleChatEnabled}>Enable</Button>
            </div>
        </div>
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

const stripUrl = (message: string) => message.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
                                             .replace(/(\/plot\?[\n\S]+)/g, '')

const MessageUrlComponent = ({message}: {message: string}) => {
    let messageUrl: string = ''
    const rex = /(?:https?|ftp):\/\/([\n\S]+)\/([\n\S]+)/
    const rex2 = /(\/plot\?[\n\S]+)/

    const matched = message.match(rex)
    const matched2 = message.match(rex2)
    if (matched) {
        const proto = matched[0]
        const host = matched[1]
        const path = matched[2]

        if(host !== location.host) {
            messageUrl = `${proto}://${host}/${path}`
        } else {
            messageUrl = `/${path}`
        }
    } else {
        if(matched2) {
            const path = matched2[0]
            messageUrl = path
        }
    }

    if(!(matched || matched2)) return null
    return (
        <Button size="tiny" variant="outline" className="ml-2">
            <a target='_blank' rel='noreferrer' href={messageUrl}>
                <span className="flex"><ExternalLink size={16} className="mr-2"/>
                View
                </span>
            </a>
        </Button>
    )
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
        <FlexCenter direction="col" >
            <div className="flex flex-1 flex-col justify-start w-full overflow-auto p-2">
                {state.messages.map(message => {

                    let messageText: string = stripUrl(message.message)

                    const tagText = message.username === state.user.username
                        ? 'You'
                        : message.username

                    const tagType = message.username === state.user.username
                        ? ''
                        : 'bg-blue-600'

                    return (
                        <div key={message.messageid}>
                            <span className="mr-2 font-mono text-muted-foreground"><ChatTime time={message.time} /></span>
                            <Badge className={'mr-2 mb-1 ' + tagType} >{tagText}</Badge>
                            {messageText} <MessageUrlComponent message={message.message}/>
                        </div>
                    )
                })}
                <div ref={chatRef} />
            </div>

            <div className="flex flex-row w-full p-[10px]">
                <div className="flex flex-1" >
                    <Input className="mr-1 w-full" type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleEnter} />
                </div>

                <div className="flex">
                    <Button onClick={sendMessage}>
                        <SendHorizonal className="mr-2"/> Send
                    </Button>
                </div>
            </div>
        </FlexCenter>
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
        <Alert variant="destructive" className="mt-2 mb-2">
        {/* <AlertTitle>Heads up!</AlertTitle> */}
        <AlertDescription>
        <div className="flex">
        <CircleAlert className="h-8 w-8" />
            <span className="mt-2 ml-2">Failed to register user {props.user.username}, try with a different username</span>
        </div>
        </AlertDescription>
      </Alert>
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
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold">Chat Registration</h1>
                <FailedRegistration user={state.user} />
                <p className="text-muted-foreground">Enter your username to join the chat</p>
                <Input type="text" className="mt-4" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <Button className="w-full mt-2" onClick={register}>Join Chat</Button>
                <Button variant="outline" className="w-full mt-2" onClick={actions.toggleChatEnabled}>Cancel</Button>
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
 * A chat widget component, which displays the chat in an embedded view.
 *
 * @returns the component
 */
export const ChatWidget = () => {
    return <Chat embedded />
}

export default Chat;