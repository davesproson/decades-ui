import { useEffect, useState } from "react"

import type { TimerConfig } from "./types"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu"

/**
 * A simple compenent which displays an editable name.
 * 
 * @param {String} name - The name to display
 * @param {function} setName - The function to call when the name is edited
 * 
 * @component
 * return {JSX.Element}
 */
const NameEditor = ({ name, setName }: {
    name: string,
    setName: (name: string) => void
}) => {
    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState(name)

    const edit = () => {
        setEditing(true)
    }

    const save = () => {
        setName(newName)
        setEditing(false)
    }

    if (editing) {
        return (
            <div className="flex">
                <Input
                    type="text"
                    size={5}
                    placeholder="Timer name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") save() }}
                />
                <Button size="sm" onClick={save}>
                    Save
                </Button>
            </div>
        )
    }

    return <Button size="sm" variant="ghost" onClick={edit}>{name}</Button>
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
const TimerContainer = (
    { name, time, buttons, inAlarm, inWarning }: {
        name: string,
        time: number,
        buttons: { text: string, onClick: () => void }[],
        inAlarm?: boolean,
        inWarning?: boolean
    }) => {

    const [displayName, setDisplayName] = useState(name)

    const extraClasses = inAlarm
        ? "bg-destructive"
        : inWarning
            ? "bg-orange-400"
            : ""

    // Format the time. We probably want to move this to a utils file or similar
    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600)
        const minutes = `${Math.floor((time % 3600) / 60)}`.padStart(2, "0")
        const seconds = `${Math.floor(time % 60)}`.padStart(2, "0")
        return `${hours}:${minutes}:${seconds}`
    }

    // Render the component
    return (
        <Card className={`m-2 ${extraClasses} flex-1`}>

            <div className={`flex flex-col flex-1 h-full`} >
                <div className={`flex flex-row justify-between`}>
                    <div className="p-1 flex">
                        <div className="flex">
                            <NameEditor name={displayName} setName={setDisplayName} />
                        </div>
                    </div>
                    <div className="p-1 flex">
                        {buttons?.map((b, i) => <Button key={i}
                            size="sm" variant="ghost" onClick={b.onClick}>{b.text}</Button>)}
                    </div>
                </div>
                <span className="p-3 flex justify-center flex-1 text-4xl items-center h-full">
                    {formatTime(time)}
                </span>
            </div>
        </Card>
    )
}

/**
 * The timer component. This component displays a timer and its buttons.
 * 
 * @param {Object} name - The name of the timer
 * 
 * return {JSX.Element} The timer component
 */
const CountUp = ({ name }: { name: string }) => {

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
const CountDown = ({ initialTime, name, warnBelow, alarmBelow }: {
    initialTime: number,
    name: string,
    warnBelow?: number,
    alarmBelow?: number

}) => {

    // Set the time to the initial time
    const it = typeof initialTime === "string" ? parseInt(initialTime) : initialTime
    const [time, setTime] = useState<number>(it)

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
            { text: 'Reset', onClick: () => setTime(initialTime) },
            { text: '+1', onClick: () => setTime(t => t + 60) },
            { text: '+5', onClick: () => setTime(t => t + 300) },
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
const Timers = ({ initialTimers }: { initialTimers?: Array<TimerConfig> }) => {

    // Initialize the timers state
    const [timers, setTimers] = useState(initialTimers || [])

    useEffect(() => {
        if (initialTimers) {
            localStorage.removeItem("timerConfig")
            return
        }
        const timerConfig = localStorage.getItem("timerConfig")
        if (timerConfig) {
            setTimers(JSON.parse(timerConfig))
        }
    }, [])


    // Map an array of timer configurations to an array of timer components
    const timerComponents = timers.map((t, i) => {
        if (t.type === "countdown") {
            return <CountDown key={i} {...t} />
        }
        return <CountUp key={i} {...t} />
    })

    /**
     * Add a countdown to the timers list, by modifying the timers state.
     * 
     * @param {String} name - The name of the countdown
     * @param {number} initialTime - The initial time of the countdown in seconds
     */
    const addCountdown = ({initialMinutes}: {initialMinutes?: number}) => {
        const initialTime = initialMinutes ? initialMinutes * 60 : 60
        const newCountdown: TimerConfig = {
            type: "countdown",
            initialTime: initialTime,
            name: "Countdown"
        }
        setTimers([...timers, newCountdown])
    }

    /**
     * Add a timer to the timers list, by modifying the timers state.
     * 
     * @param {String} name - The name of the timer
     */
    const addCountUp = () => {
        const newCountUp: TimerConfig = {
            type: "countup",
            initialTime: 0,
            name: "Timer"
        }
        setTimers([...timers, newCountUp])
    }

    if (timerComponents.length === 0) {
        return (
            <div className="flex flex-col">
                <Button className="w-full" onClick={()=>addCountdown({initialMinutes: 1})}>Add countdown</Button>
                <Button className="w-full" onClick={addCountUp}>Add timer</Button>
            </div>
        )
    }

    // Render the timers component
    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger >
                    <div className="flex flex-wrap h-full w-full">
                        {timerComponents}
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={addCountUp}>
                        Add Timer
                    </ContextMenuItem>

                    <ContextMenuSub>
                        <ContextMenuSubTrigger>Add Countdown</ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ContextMenuItem onClick={()=>addCountdown({initialMinutes: 1})}>1 Minute</ContextMenuItem>
                            <ContextMenuItem onClick={()=>addCountdown({initialMinutes: 5})}>5 Minutes</ContextMenuItem>
                            <ContextMenuItem onClick={()=>addCountdown({initialMinutes: 10})}>10 Minutes</ContextMenuItem>
                            <ContextMenuItem onClick={()=>addCountdown({initialMinutes: 30})}>30 Minutes</ContextMenuItem>
                        </ContextMenuSubContent>
                    </ContextMenuSub>


                </ContextMenuContent>
            </ContextMenu>

        </>
    )
}

export default Timers