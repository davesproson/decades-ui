import "../../assets/css/no-scroll.css"

import { useHeadingIndicator, useHeadingResizer } from "./hooks"

interface HeadingIndicatorGraphicProps {
    heading: number,
    track: number,
    wind: number,
    widthOrHeight: { [key: string]: number }
}
const HeadingIndicatorGraphic = (props: HeadingIndicatorGraphicProps) => {
    const getStyle = (rotation: number): React.CSSProperties => {

        return {
            position: "absolute",
            transform: `rotate(${rotation}deg)`,
            ...props.widthOrHeight
        }
    }

    return (
        <>
            <img src="heading/heading_indicator.svg" style={getStyle(-props.heading)}></img>
            <img src="heading/aircraft.svg" style={getStyle(0)}></img>
            <img src="heading/track_indicator.svg" style={getStyle(props.track - props.heading)}></img>
            <img src="heading/wind_indicator.svg" style={getStyle(props.wind - props.heading)}></img>
        </>
    )
}

interface HeadingIndicatorProps {
    standalone?: boolean
}
const HeadingIndicator = (props: HeadingIndicatorProps) => {
    const data = useHeadingIndicator()
    const [ref, widthOrHeight] = useHeadingResizer()

    const containerStyle: React.CSSProperties = props.standalone
        ? { position: "absolute", top: "50%", width: "100%", height: "100%" }
        : { position: "relative", top: "50%" }


    return (
        <div ref={ref} style={containerStyle}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <HeadingIndicatorGraphic
                    wind={data.windAngle}
                    track={data.trackAngle}
                    heading={data.heading}
                    widthOrHeight={widthOrHeight} />
            </div>
        </div>
    )
}

export default HeadingIndicator
export { HeadingIndicator }
