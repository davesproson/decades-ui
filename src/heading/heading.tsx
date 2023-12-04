import { useHeadingIndicator } from "./hooks"

const HeadingIndicator = () => {
    const data = useHeadingIndicator()
    
    // Note size is currently hardcoded to 300px TODO!
    return (
        <div>
            <img src="heading/heading_indicator.svg" style={{position: "absolute", top: 0, left: 0, width: "300px", transform: `rotate(${-data.heading}deg)`}}></img>
            <img src="heading/aircraft.svg" style={{position: "absolute", top: 0, left: 0, width: "300px"}}></img>
            <img src="heading/track_indicator.svg" style={{position: "absolute", top: 0, left: 0, width: "300px",transform: `rotate(${data.trackAngle-data.heading}deg)`}}></img>
            <img src="heading/wind_indicator.svg" style={{position: "absolute", top: 0, left: 0, width: "300px",transform: `rotate(${data.windAngle-data.heading}deg)`}}></img>
        </div>
    )
}

export default HeadingIndicator
export { HeadingIndicator }