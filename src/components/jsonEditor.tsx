import { Button } from "./buttons"

interface JsonEditorProps {
    display: boolean,
    text: string,
    title?: string,
    onEdit: (text: string) => void,
    checkValid?: (text: string) => boolean,
    getUrl?: () => string | null,
    onLaunch?: (text: string) => void,
    openExternal?: boolean
}
const JsonEditor = (props: JsonEditorProps) => {

    if (!props.display) return null

    const checkValid = () => {
        try {
            JSON.parse(props.text)
        } catch (e) {
            return false
        }
        if(props.checkValid) return props.checkValid(props.text)
        return true
    }

    const jsonChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const json = e.target.value
        props.onEdit(json)
    }

    const getUrl = () => {
        if(props.getUrl) return props.getUrl()
        else throw new Error("getUrl not defined")
    }

    const onLaunch = () => {
        if (!checkValid()) return null
        if(props.onLaunch) return props.onLaunch(props.text)
        return null
    }
 
    const bgClass = checkValid() ? "has-background-success-light" : "has-background-danger-light"


    return (
        <article className="message is-dark">
            <div className="message-header">
                <p>JSON Editor</p>
            </div>
            <div className="message-body">
                <div className="block">
                    <div className="field">
                        <div className="control">
                            <textarea className={`textarea ${bgClass}`}
                                      placeholder="Type your json here..."
                                      rows={20}
                                      value={props.text} 
                                      style={{fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New"}}
                                      onChange={jsonChanged} />
                        </div>
                    </div>
                </div>
                <div className="block">
                    <Button.Primary anchor fullWidth
                            href={getUrl()|| ''} // TODO: fix this
                            onClick={onLaunch}
                            target={props.openExternal ? "_blank" : undefined}
                            disabled={!checkValid()}
                    >
                        Launch
                    </Button.Primary>
                </div>  
            </div>
        </article>
    )
}

export { JsonEditor }