import { useState } from "react"
import { Button } from "@/components/ui/button";
import { useFlightSummary } from "./hooks";
import { Link } from "@tanstack/react-router";

import type { FlightSummaryEntry } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogTitle, AlertDialogContent, AlertDialogHeader, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Show } from "@/components/flow";

export const Info = ({ entry, clearEntry }: { entry: FlightSummaryEntry | null, clearEntry: () => void }) => {
    if (!entry) return null

    return (
        <AlertDialog open={!!entry} onOpenChange={clearEntry}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{entry.event}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    A dialog showing the details of the event
                </AlertDialogDescription>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Start</TableHead>
                            <TableHead>Stop</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="p-1"><strong>Time</strong></TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-start-time">{new Date(entry.start.time * 1e3).toLocaleTimeString()}</TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-end-time">{entry.stop.time ? new Date(entry.stop.time * 1e3).toLocaleTimeString() : ""}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="p-1"><strong>Latitude</strong></TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-start-lat">{entry.start.latitude.toFixed(2)} °</TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-end-lat">{entry.stop.latitude ? `${entry.stop.latitude.toFixed(2)} °` : ""}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="p-1"><strong>Longitude</strong></TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-start-lon">{entry.start.longitude.toFixed(2)} °</TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-end-lon">{entry.stop.longitude ? `${entry.stop.longitude.toFixed(2)} °` : ""}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="p-1"><strong>Altitude</strong></TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-start-alt">{entry.start.altitude} ft</TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-stop-alt">{entry.stop.altitude ? `${entry.stop.altitude} ft` : ""}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="p-1"><strong>Heading</strong></TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-start-hdg">{entry.start.heading.toFixed(0)}°</TableCell>
                            <TableCell className="p-1" data-testid="fs-evt-end-hdg">{entry.stop.heading ? `${entry.stop.heading.toFixed(0)}°` : ""}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {entry.comment && <p>{entry.comment}</p>}
                 <Button onClick={() => clearEntry()} className="mt-2">Close</Button>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const FlightSummary = ({ hasNavbar }: { hasNavbar?: boolean }) => {

    const [detail, setDetail] = useState<FlightSummaryEntry | null>(null)
    const data = useFlightSummary()

    const numValidEntries = data
        ? Object.values(data).filter((evt) => !evt.deleted).length
        : 0


    if (!numValidEntries) return (
        <div className="absolute inset-0 flex justify-center items-center" >
            <div className="flex flex-col items-center">
                <h3 className="text-2xl">No flight summary yet!</h3>
                <Show when={!!hasNavbar}>
                    <Button asChild className="mt-4">
                        <Link to="/">Home</Link>
                    </Button>
                </Show>
            </div>
        </div>
    )

    return (
        <div className={hasNavbar ? "mt-6 overflow-y-auto" : "absolute inset-0 overflow-y-auto"}>
            <Info entry={detail} clearEntry={() => setDetail(null)} />
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Start time</TableHead>
                        <TableHead className="hidden md:table-cell">Start lat</TableHead>
                        <TableHead className="hidden md:table-cell">Start lon</TableHead>
                        <TableHead className="hidden lg:table-cell">Start alt</TableHead>
                        <TableHead className="hidden lg:table-cell">Start hdg</TableHead>
                        <TableHead>End time</TableHead>
                        <TableHead className="hidden md:table-cell">End lat</TableHead>
                        <TableHead className="hidden md:table-cell">End lon</TableHead>
                        <TableHead className="hidden lg:table-cell">End alt</TableHead>
                        <TableHead className="hidden lg:table-cell">End hdg</TableHead>
                        <TableHead>Comment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data && Object.values(data).reverse().map((evt: any) => {
                        if (evt.deleted) return null
                        const rowClass = evt.ongoing ? "bg-blue-400 dark:bg-blue-600" : ""
                        return (
                            <TableRow key={evt.uuid} className={rowClass}>
                                <TableCell className="p-2"><button onClick={() => setDetail(evt)} style={{ all: "unset", cursor: "pointer" }}>{evt.event}</button></TableCell>
                                <TableCell className="p-2">{new Date(evt.start.time * 1e3).toLocaleTimeString()}</TableCell>
                                <TableCell className="p-2 hidden md:table-cell">{evt.start.latitude?.toFixed(2)} °</TableCell>
                                <TableCell className="p-2 hidden md:table-cell">{evt.start.longitude?.toFixed(2)} °</TableCell>
                                <TableCell className="p-2 hidden lg:table-cell">{evt.start.altitude} ft</TableCell>
                                <TableCell className="p-2 hidden lg:table-cell">{evt.start.heading?.toFixed(0)}°</TableCell>
                                <TableCell className="p-2 ">{evt?.stop?.time ? new Date(evt.stop.time * 1e3).toLocaleTimeString() : ""}</TableCell>
                                <TableCell className="p-2 hidden md:table-cell">{evt.stop.time && `${evt.stop?.latitude?.toFixed(2)} °`}</TableCell>
                                <TableCell className="p-2 hidden md:table-cell">{evt.stop.time && `${evt.stop?.longitude?.toFixed(2)} °`}</TableCell>
                                <TableCell className="p-2 hidden lg:table-cell">{evt.stop.time && `${evt.stop.altitude} ft`}</TableCell>
                                <TableCell className="p-2 hidden lg:table-cell">{evt.stop.time && `${evt.stop.heading?.toFixed(0)}°`}</TableCell>
                                <TableCell>{evt.comment}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default FlightSummary