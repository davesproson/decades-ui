import { DecadesBreadCrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/navbar";
import { useDispatch, useSelector } from "@/redux/store";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AlarmProps } from "./types";
import { addNewAlarm, modifyAlarm, removeAlarm } from "@/redux/alarmSlice";
import { useState } from "react";
import { When } from "@/components/flow";

const AlarmConfigPanel = (props: AlarmProps) => {
    const dispatch = useDispatch()
    const [expanded, setExpanded] = useState(true)
    const [animate, setAnimate] = useState(false)

    const rotClass = animate ? "animate-rot180" : "rotate-180"

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>
                    <span className="flex justify-between">
                        <span>
                            <span className="flex flex-col">
                                <When condition={expanded}>
                                    <Label className="mb-1" htmlFor="name">Alarm name</Label>
                                    <Input id="name" value={props.name} onChange={(e) => dispatch(modifyAlarm({ id: props.id, name: e.target.value }))} />
                                </When>
                                <When condition={!expanded}>
                                    {props.name}
                                </When>

                            </span>
                            <span className="flex items-center space-x-2 mt-4">
                                <CardDescription>
                                    <When condition={expanded}>
                                        <Label htmlFor="description">Alarm decription</Label>
                                        <Input id="description" value={props.description} onChange={(e) => dispatch(modifyAlarm({ id: props.id, description: e.target.value }))} />
                                    </When>
                                    <When condition={!expanded}>
                                        {props.description}
                                    </When>
                                </CardDescription>
                            </span>
                        </span>
                        {expanded && <ChevronDown onClick={() => { setExpanded(x => !x); setAnimate(true) }} className={rotClass} />}
                        {!expanded && <ChevronUp onClick={() => { setExpanded(x => !x); setAnimate(true) }} className={rotClass} />}
                    </span>
                </CardTitle>
            </CardHeader>
            {expanded && <>
                <CardContent>
                    <Label htmlFor="params">Parameters</Label>
                    <Input className="mb-4" id="params" placeholder="Enter a comma-separated list of required parameters" value={props.parameters.join(",")} onChange={(e) => dispatch(modifyAlarm({id:props.id, parameters: e.target.value.split(',')}))}/>

                    <Label htmlFor="rule">Rule</Label>
                    <Input className="mb-4" id="rule" placeholder="Enter a rule using mathjs logic" value={props.rule} onChange={(e) => dispatch(modifyAlarm({id: props.id, rule: e.target.value}))} />

                    <div className="flex justify-between">
                        <div className="flex flex-col flex-1 mr-2 mt-2">
                            <Label className="mb-1" htmlFor="rule">Passing Text</Label>
                            <Input className="mb-4" id="rule" placeholder="Text when alarm is passing" value={props.passingText} onChange={e => dispatch(modifyAlarm({id: props.id, passingText: e.target.value }))}/>
                        </div>

                        <div className="flex flex-col flex-1 ml-2 mt-2">
                            <Label className="mb-1" htmlFor="rule">Failing Text</Label>
                            <Input className="mb-4" id="rule" placeholder="Text when alarm is failing" value={props.failingText} onChange={e => dispatch(modifyAlarm({id: props.id, failingText: e.target.value}))}/>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                        <Checkbox id="failOnNoData" checked={props.failOnNoData} onCheckedChange={() => dispatch(modifyAlarm({ id: props.id, failOnNoData: !props.failOnNoData }))} />
                        <label
                            htmlFor="failOnNoData"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Fail if no data is available
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="flash" checked={!props.disableFlash} onCheckedChange={() => dispatch(modifyAlarm({ id: props.id, disableFlash: !props.disableFlash }))} />
                        <label
                            htmlFor="flash"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Flash when alarm is failing
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="destructive" onClick={() => dispatch(removeAlarm({ id: props.id }))}>Delete</Button>
                </CardFooter>
            </>}
        </Card>
    )
}

const AlarmConfigArea = () => {
    const alarms = useSelector(state => state.alarms.alarms)
    const dispatch = useDispatch()

    return (
        <>
            <Button className="mb-2 w-full" onClick={() => dispatch(addNewAlarm())}>Add new alarm</Button>
            {Object.values(alarms).map((alarm) => (
                <AlarmConfigPanel key={alarm.id} {...alarm} />
            ))}
        </>
    );
}

export const AlarmConfig = () => {
    return (
        <Navbar>
            <DecadesBreadCrumb
                crumbs={[
                    { label: "Alarm Configuration" },
                ]}
            />
            <AlarmConfigArea />
        </Navbar>
    )
}