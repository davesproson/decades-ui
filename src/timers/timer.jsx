import { useEffect } from "react"
import { useState } from "react"

import { Button } from "../components/buttons"

/**
 * A simple compenent which displays an editable name.
 * 
 * @param {String} name - The name to display
 * @param {function} setName - The function to call when the name is edited
 * 
 * @component
 * return {JSX.Element}
 */
const NameEditor = ({ name, setName }) => {
    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState(name)

    const edit = () => {
        setEditing(true)
    }

    const save = (e) => {
        setName(newName)
        setEditing(false)
    }

    if (editing) {
        return (
            <div className="field has-addons is-small">
                <div className="control">
                    <input className="input is-small" 
                           type="text"
                           placeholder="Timer name"
                           value={newName}
                           onChange={e=>setNewName(e.target.value)}
                           onKeyDown={e=>{if (e.key === "Enter") save()}}
                    />
                </div>
                <div className="control">
                    <a className="button is-info is-small" onClick={save}>
                        Save
                    </a>
                </div>
            </div>
        )
    }

    return <Button.Info small outlined onClick={edit}>{name}</Button.Info>
}

/**
 * The timer container component. This component displays a timer and its buttons.
 * It wraps either a timer or a countdown component.
 * 
 * @param {Object} name - The name of the timer
 * @param {number} time - The time of the timer
 * @param {Object} buttons - The buttons to display
 * @param {boolean} inAlarm - Whether the timer is in alarm (countdown only)
 * @param {boolean} inWarning - Whether the timer is in warning (countdown only)
 * 
 * return {JSX.Element} The timer container component
 */
const TimerContainer = ({ name, time, buttons, inAlarm, inWarning }) => {

    const [displayName, setDisplayName] = useState(name)

    // Container style
    const panelStyle = {
        border: "1px solid black",
        borderRadius: "5px",
        background: inAlarm
            ? "#ec6463"
            : inWarning
                ? "orange"
                : "white",
    }

    // Format the time. We probably want to move this to a utils file or similar
    const formatTime = (time) => {
        const hours = Math.floor(time / 3600)
        const minutes = `${Math.floor((time % 3600) / 60)}`.padStart(2, "0")
        const seconds = `${Math.floor(time % 60)}`.padStart(2, "0")
        return `${hours}:${minutes}:${seconds}`
    }

    // Render the component
    return (
        <div className="m-2 is-flex is-flex-grow-1" style={panelStyle}>

            <div className={`is-flex is-flex-direction-column is-flex-grow-1`} >
                <div className={`is-flex is-flex-direction-row is-justify-content-space-between`} style={{
                    background: "#252243",
                    color: "#0abbef",
                    borderBottom: "1px solid black",
                }}>
                    <div className="p-3 is-uppercase is-flex">
                        <div className="is-flex">
                            <NameEditor name={displayName} setName={setDisplayName} />
                        </div>
                    </div>
                    <div className="m-2 is-flex">
                        {buttons?.map((b, i) => <Button.Info key={i} 
                        small outlined onClick={b.onClick}>{b.text}</Button.Info>)}
                    </div>
                </div>

                <span className="p-3 is-flex is-justify-content-center is-size-3 is-flex-grow-1">
                    {formatTime(time)}
                </span>
            </div>
        </div>
    )
}

/**
 * The timer component. This component displays a timer and its buttons.
 * 
 * @param {Object} name - The name of the timer
 * 
 * return {JSX.Element} The timer component
 */
const CountUp = ({name}) => {

    // Initialize the time to 0
    const [time, setTime] = useState(0)

    // Increment the time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(t => t + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Render the timer container, with a reset button
    return <TimerContainer time={time} name={name} buttons={[
        { text: 'Reset', onClick: () => setTime(0) }
    ]} />
}


/**
 * A countdown component. This component displays a countdown and its buttons.
 * 
 * @param {Object} name - The name of the timer
 * @param {number} initialTime - The initial time of the countdown in seconds
 * @param {number} warnBelow - The time below which the countdown is in warning
 * @param {number} alarmBelow - The time below which the countdown is in alarm
 * 
 * return {JSX.Element} The countdown component
 */
const CountDown = ({initialTime, name, warnBelow, alarmBelow}) => {

    // Set the time to the initial time
    const [time, setTime] = useState(parseInt(initialTime))

    // Decrement the time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(t => t === 0 ? 0 : t - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Render the timer container, with a reset button and +1/+5 min buttons
    return <TimerContainer 
                time={time}
                inAlarm={time < (alarmBelow || 20)}
                inWarning={time < (warnBelow || 60)} 
                name={name} buttons={[
                    { text: 'Reset', onClick: () => setTime(initialTime)},
                    { text: '+1', onClick: () => setTime(t => t + 60)},
                    { text: '+5', onClick: () => setTime(t => t + 300)},
                ]} 
            />
}

/**
 * The timers component. This component displays a list of timers, which
 * can be either timers or countdowns, and a context menu to add new timers.
 * 
 * @param {Array} initialTimers - The initial timers to display
 * 
 * return {JSX.Element} The timers component
 */
const Timers = ({initialTimers}) => {

    // Initialize the timers state
    const [timers, setTimers] = useState(initialTimers || [])
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 10, y: 10 })

    useEffect(() => {
        if(initialTimers) {
            localStorage.removeItem("timerConfig")
            return
        }
        const timerConfig = localStorage.getItem("timerConfig")
        if(timerConfig) {
            setTimers(JSON.parse(timerConfig))
        }
    }, [])

    // If there are no timers, just show the context menu and an element to add a timer
    useEffect(() => {
        setShowContextMenu(timers.length === 0)
    }, [timers])

    // Map an array of timer configurations to an array of timer components
    const timerComponents = timers.map((t, i) => {
        if(t.type === "countdown") {
            return <CountDown key={i} {...t} />
        }
        return <CountUp key={i} {...t} />
    })

    /**
     * Context menu handler. This function is called when the user right-clicks
     * on the timers component. It displays the context menu at the position of
     * the click.
     * 
     * @param {Event} e - The click event 
     */
    const onContextMenu = (e) => {
        e.preventDefault()
        const x = e.clientX
        const y = e.clientY
        setContextMenuPosition({ x, y })
        setShowContextMenu(true)
        setTimeout(() => {
            setShowContextMenu(false)
        }, 3000)
    }

    /**
     * Add a countdown to the timers list, by modifying the timers state.
     * 
     * @param {String} name - The name of the countdown
     * @param {number} initialTime - The initial time of the countdown in seconds
     */
    const addCountdown = ({name, initialTime}) => {
        const newCountdown = { 
            type: "countdown",
            initialTime: initialTime || 60,
            name: name || "Countdown"
        }
        setTimers([...timers, newCountdown])
    }

    /**
     * Add a timer to the timers list, by modifying the timers state.
     * 
     * @param {String} name - The name of the timer
     */
    const addCountUp = ({name}) => {
        const newCountUp = {
            type: "timer",
            time: 0,
            name: name || "Timer"
        }
        setTimers([...timers, newCountUp])
    }

    // Render the timers component
    return (
        <>
            <div style={{
                position: timers.length ? "absolute" : "relative",
                display: showContextMenu ? "block": "none",
                top: contextMenuPosition.y - 10,
                left: contextMenuPosition.x - 10,
                background: "#ffffff88",
                padding: "3px",
                border: timers.length ? "1px solid black" : "",
                zIndex: 100,
                borderRadius: "5px",
            }}
                onMouseLeave={() => {if(timers.length) setShowContextMenu(false)}}
            >
                <Button.Info extraClasses="mr-1" onClick={addCountUp}>New Timer</Button.Info>
                <Button.Info onClick={addCountdown}>New Countdown</Button.Info>
            </div>
            <div onContextMenu={onContextMenu}>
                <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
                    {timerComponents}
                </div>
            </div>
        </>
    )
}

export default Timers