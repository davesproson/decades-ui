import { useState } from 'react'
import { useAlarm, useAlarmUrl, useFlash } from './hooks'
import type { AlarmListProps, AlarmProps } from './types'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu'


/**
 * AlarmList is a component that displays a list of alarms. It uses the useAlarmUrl hook to
 * parse alarms from the search params and remove them from the search params when the user
 * clicks the delete button
 * 
 * @component
 * @example
 * return (
 * <AlarmList />
 * )
 */
const AlarmList = (props: AlarmListProps) => {

    const [alarms, setAlarms] = useState(props.alarms || [])
    const [_removeAlarm, alarmParams] = useAlarmUrl(setAlarms, props)


    if (!alarms?.length) {
        if (props.alarms) {
            setAlarms(props.alarms.map(a => ({ ...a, id: a.name })))
        }
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0px" }}>
            {alarms.map(a => <Alarm key={a.id} {...a} {...alarmParams} />)}
        </div>
    )

}

const RuleHoverCard = ({ children, rule }: { children: React.ReactNode, rule: string }) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
                <div className="flex justify-between">
                    <p className="text-sm font-mono">
                        {rule}
                    </p>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}


const Alarm = (props: AlarmProps) => {

    const {passing, muted, setMuted}  = useAlarm(props)
    const flashActive = useFlash(600)

    let messageClass = passing
        ? "bg-green-600"
        : passing === undefined
            ? "bg-gray-200 dark:bg-gray-800"
            : flashActive
                ? props.disableFlash
                    ? "bg-destructive"
                    : "bg-red-700"
                : "bg-destructive"

    const messageText = passing
        ? props.passingText || "PASS"
        : passing === undefined
            ? "UNKNOWN"
            : props.failingText || "FAIL"

    if (props.display) {
        const tagSize = props.display === "compact" ? null : "is-large"
        return (
            <span className={`tag ${tagSize} ${messageClass} mr-1`}>{props.name}</span>
        )
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <article className={"rounded-md flex justify-between p-4 m-1 items-center text-sm h-[95%] " + messageClass}>
                    <div className="flex justify-between w-full">
                        <span>
                            <RuleHoverCard rule={props.rule}>
                                <strong className="cursor-help">
                                    {props.name}
                                </strong>
                            </RuleHoverCard>
                        </span>
                        <span className="ml-5">{props.description}</span>
                        <span className="mr-2 ml-2">{messageText}</span>
                    </div>
                </article>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuCheckboxItem checked={muted} onCheckedChange={() => {setMuted(x=>!x) }} >
                    Muted
                </ContextMenuCheckboxItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default AlarmList