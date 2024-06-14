import { useState } from "react"
import { Button } from "../components/buttons";
import { useFlightSummary } from "./hooks";

const Info = ({entry, clearEntry}: {entry: FlightSummaryEntry|null, clearEntry: ()=>void}) => {
    if (!entry) return null

    return (
        <div style={{display: "flex", position: "absolute", inset:0, backgroundColor: "rgba(0,0,0,0.7)"}}>
            <div style={{justifyContent: "center", alignItems: "center", display: "flex", width: "100%", height: "100%"}} onClick={clearEntry}>
            <article className="message">
                <div className="message-body">
                    <div className="is-flex is-flex-direction-column is-justify-content-space-between">
                    <span className="is-flex is-flex-grow-1 is-flex-direction-column">
                        <h3 className="subtitle">{entry.event}</h3>
                        <table className="table is-narrow">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Start</th>
                                    <th>Stop</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Time</strong></td>
                                    <td>{new Date(entry.start.time * 1e3).toLocaleTimeString()}</td>
                                    <td>{entry.stop.time ? new Date(entry.stop.time * 1e3).toLocaleTimeString() : ""}</td>
                                </tr>
                                <tr>
                                    <td><strong>Latitude</strong></td>
                                    <td>{entry.start.latitude.toFixed(2)} °</td>
                                    <td>{entry.stop.latitude ? `${entry.stop.latitude.toFixed(2)} °` : ""}</td>
                                </tr>
                                <tr>
                                    <td><strong>Longitude</strong></td>
                                    <td>{entry.start.longitude.toFixed(2)} °</td>
                                    <td>{entry.stop.longitude ? `${entry.stop.longitude.toFixed(2)} °` : ""}</td>
                                </tr>
                                <tr>
                                    <td><strong>Altitude</strong></td>
                                    <td>{entry.start.altitude} ft</td>
                                    <td>{entry.stop.altitude ? `${entry.stop.altitude} ft` : ""}</td>
                                </tr>
                                <tr>
                                    <td><strong>Heading</strong></td>
                                    <td>{entry.start.heading.toFixed(0)}°</td>
                                    <td>{entry.stop.heading ? `${entry.stop.heading.toFixed(0)} °` : ""}</td>
                                </tr>
                            </tbody>
                        </table>
                        {entry.comment && <p>{entry.comment}</p>}
                    </span>
                <Button.Light onClick={() => clearEntry()} extraClasses="mt-2">Close</Button.Light>
                </div>
                </div>  
            </article>
            </div>
        </div>
    )
}

const FlightSummary = ({hasNavbar}: {hasNavbar?: boolean}) => {
    
    const [detail, setDetail] = useState<FlightSummaryEntry|null>(null)
    const data = useFlightSummary()

    return (
        <div className={hasNavbar ? "mt-6": ""}>
            <Info entry={detail} clearEntry={()=>setDetail(null)}/>
            <table className="table is-hoverable is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Start time</th>
                        <th className="is-hidden-touch">Start lat</th>
                        <th className="is-hidden-touch">Start lon</th>
                        <th className="is-hidden-touch is-hidden-desktop-only">Start alt</th>
                        <th className="is-hidden-touch is-hidden-desktop-only">Start hdg</th>
                        <th>End time</th>
                        <th className="is-hidden-touch">End lat</th>
                        <th className="is-hidden-touch">End lon</th>
                        <th className="is-hidden-touch is-hidden-desktop-only">End alt</th>
                        <th className="is-hidden-touch is-hidden-desktop-only">End hdg</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {data && Object.values(data).reverse().map((evt: any) => {
                        const rowClass = evt.ongoing ? "has-background-info" : ""
                        return (
                            <tr key={evt.uuid} className={rowClass}>
                                <td><button onClick={()=>setDetail(evt)} style={{all:"unset", cursor: "pointer"}}>{evt.event}</button></td>
                                <td>{new Date(evt.start.time * 1e3).toLocaleTimeString()}</td>
                                <td className="is-hidden-touch">{evt.start.latitude?.toFixed(2)} °</td>
                                <td className="is-hidden-touch">{evt.start.longitude?.toFixed(2)} °</td>
                                <td className="is-hidden-touch is-hidden-desktop-only">{evt.start.altitude} ft</td>
                                <td className="is-hidden-touch is-hidden-desktop-only">{evt.start.heading?.toFixed(0)}°</td>
                                <td>{evt?.stop?.time ? new Date(evt.stop.time * 1e3).toLocaleTimeString() : ""}</td>
                                <td className="is-hidden-touch">{evt.stop.time && `${evt.stop?.latitude?.toFixed(2)} °`}</td>
                                <td className="is-hidden-touch">{evt.stop.time && `${evt.stop?.longitude?.toFixed(2)} °`}</td>
                                <td className="is-hidden-touch is-hidden-desktop-only">{evt.stop.time && `${evt.stop.altitude} ft`}</td>
                                <td className="is-hidden-touch is-hidden-desktop-only">{evt.stop.time && `${evt.stop.heading?.toFixed(0)}°`}</td>
                                <td>{evt.comment}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default FlightSummary