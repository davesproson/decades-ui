import { useState } from "react"
import { JsonEditor } from "../components/jsonEditor"
import { Button } from "../components/buttons"
import { base as siteBase } from "../settings"


/** 
 * The alarm editor component. This component implements a json editor for the alarm
 * configuration. It also provides a button to launch the alarm viewer.
 * 
 * @param {Object} props - The props for the component
 * @param {boolean} props.display - Whether the component is displayed
 * @param {string} props.text - The text to display in the editor
 * @param {function} props.onEdit - The function to call when the text is edited
 * 
 * @component
 * @example
 * <AlarmEditor display={true} text={text} onEdit={onEdit} />
 * 
*/
const TimerEditor = (props) => {

    if (!props.display) return null
    const [jsonText, setJsonText] = useState("[]")

    /** 
    * Check that the json is valid
    *
    * @param {string} json - The json to check
    * @returns {boolean} Whether the json is valid
    */
    const checkValid = (json) => {
        try {
            const parsed = JSON.parse(json)

            if (!Array.isArray(parsed)) return false

            return true
        } catch (e) {
            return false
        }
    }

    /**
     * Get the url for the alarms according to the current configuration
     * 
     * @returns {string} The url for the alarms
     */
    const getUrl = () => {
        if (!checkValid(jsonText)) return null
        return `${siteBase}timers`
    }


    return (
        <JsonEditor checkValid={checkValid}
            display={props.display}
            openExternal={true}
            onEdit={setJsonText}
            text={jsonText}
            getUrl={getUrl}
            onLaunch={(text) => {
                localStorage.setItem("timerConfig", JSON.stringify(JSON.parse(text)))
            }}
        />
    )
}

const TimerInfo = (props) => {

    return (
        <article className="message is-dark">
            <div className="message-header">
                <p>Timers</p>
                <button className="delete" aria-label="delete" onClick={props.hide}></button>
            </div>
            <div className="message-body">
                <div className="block">Timers provide simple stopwatch and countdown timers</div>
                <div className="block">
                    Timers are specified with a <strong>json</strong> defintion. For example, the json below will
                    create a timer with a name of <strong>My Timer</strong>, counting up from 0, and a countdown timer
                    with a name of <strong>My Countdown</strong> counting down from 5 mintutes (300 seconds).
                </div>
                <div className="block">
                    If you <strong>Launch</strong> with an empty array, you'll get a blank page to
                    which you can add timers. In this case, countdown timers will default to 1 minute,
                    but you can add time to these in intervals of 1 or 5 minutes.
                </div>
                <pre>
                    <code>
                        {`[{
    "name": "My Timer",
    "type": "timer"
}, {
    "name": "My Countdown",
    "type": "countdown",
    "time": 300,
    "alarmBelow": 20,
    "warnBelow": 60
}]`}
                    </code>
                </pre>
            </div>
        </article>
    )
}

const TimerConfig = (props) => {
    const [displayEditor, setDisplayEditor] = useState(false)

    let component = null

    if (displayEditor) {
        component = <TimerEditor display={true} text={props.text} onEdit={props.onEdit} />
    } else {
        component = (
            <>
                <TimerInfo hide={() => setDisplayEditor(true)} />
                <Button.Primary outlined fullWidth onClick={() => setDisplayEditor(!displayEditor)}>
                    Begin...
                </Button.Primary>
            </>
        )
    }

    return (
        <div className="container mt-2">
            <div className="section">
                {component}
            </div>
        </div>
    )
}

export default TimerConfig