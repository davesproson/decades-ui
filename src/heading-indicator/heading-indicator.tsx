import { FlexCenter } from "@/components/layout"

import { useHeadingIndicator, useHeadingResizer } from "./hooks"

import headingIndicatorSvg from "@/assets/heading-indicator/heading-indicator.svg"
import trackIndicatorSvg from "@/assets/heading-indicator/track-indicator.svg"
import windIndicatorSvg from "@/assets/heading-indicator/wind-indicator.svg"
import aircraftSvg from "@/assets/heading-indicator/aircraft.svg"

interface HeadingIndicatorGraphicProps {
    heading: number | undefined,
    track: number | undefined,
    wind: number | undefined,
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

    const headingIndicator = props.heading === undefined
        ? null
        : <img src={headingIndicatorSvg} style={getStyle(-props.heading)}></img>

    const trackIndicator = (props.track === undefined || props.heading === undefined)
        ? null
        : <img src={trackIndicatorSvg} style={getStyle(props.track - props.heading)}></img>

    const windIndicator = (props.wind === undefined || props.heading === undefined)
        ? null
        : <img src={windIndicatorSvg} style={getStyle(props.wind - props.heading)}></img>

    const noDataIndicator = (props.heading === undefined && props.track === undefined && props.wind === undefined)
        ? <span style={
            {
                position: "absolute",
                fontSize: "2vmin",
                fontWeight: "bold",
                transform: `translate(0, -50%)`,
                color: "red"
            }
        }>No Data</span>
        : null

    return (
        <>
            {headingIndicator}
            <img src={aircraftSvg} style={getStyle(0)}></img>
            {noDataIndicator}
            {trackIndicator}
            {windIndicator}
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
        ? { position: "absolute", width: "100%", height: "100%" }
        : { position: "relative" }


    return (
        <div ref={ref} style={containerStyle}>
            <FlexCenter>
                <HeadingIndicatorGraphic
                    wind={data.windAngle}
                    track={data.trackAngle}
                    heading={data.heading}
                    widthOrHeight={widthOrHeight} />
            </FlexCenter>
        </div>
    )
}

export default HeadingIndicator
export { HeadingIndicator }