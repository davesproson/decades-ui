import { useRef } from "react"
import { useDarkMode } from "@/components/theme-provider"
import { FlexCenter } from "@/components/layout"
import { usePitchIndicator } from "./hooks"

// Assets
import aircraftSideAspect from "@/assets/aircraft/gluxe/side-aspect.svg"
import { useScrollInhibitor } from "@/hooks"

const PitchIndicatorSvgText = ({ pitch }: { pitch: number | undefined }) => {
    const darkMode = useDarkMode()

    const containerStyle: React.CSSProperties = {
        position: "absolute",
        width: "100%"
    }
    const color = pitch === undefined
        ? "red"
        : darkMode ? "white" : "black"

    const pitchText = pitch === undefined
        ? "No Data"
        : `${pitch < 0 ? "" : "+"}${pitch.toFixed(1)}°`

    return (
        <div style={containerStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="100%">
                <text x="200" y="70" fill={color} textAnchor="middle" fontSize={"1.8em"}>
                    {pitchText}
                </text>
            </svg>
        </div>
    )
}

const ReferenceLine = () => {

    const containerStyle: React.CSSProperties = {
        position: "absolute",
        width: "100%",
    }
    const color = "red"
    return (
        <div style={containerStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"  {...{ width: "100%" }}>
                <line x1="0" y1="120" x2="400" y2="120" stroke-dasharray="5,5" stroke={color} strokeWidth=".5" />
            </svg>
        </div>
    )
}

interface PitchIndicatorGraphicProps {
    pitch: number | undefined,
}
const PitchIndicatorGraphic = (props: PitchIndicatorGraphicProps) => {

    const darkMode = useDarkMode()

    const getStyle = (rotation: number): React.CSSProperties => {

        return {
            position: "absolute",
            transform: `rotate(${-rotation}deg)`,
            width: "100%",
        }
    }

    const dmFilter = "invert(63%) sepia(2%) saturate(13%) hue-rotate(331deg) brightness(86%) contrast(79%)"

    const filter = darkMode ? dmFilter : ""

    const ProfileImage = () => {
        const castPitch = props.pitch === undefined ? 0 : props.pitch
        return (
            <img src={aircraftSideAspect} style={{ ...getStyle(castPitch), filter: filter }}></img>
        )
    }

    return (
        <>
            <PitchIndicatorSvgText pitch={props.pitch} />
            <ReferenceLine />
            <ProfileImage />
        </>
    )
}

interface PitchIndicatorProps {
    standalone?: boolean
}
const PitchIndicator = (props: PitchIndicatorProps) => {
    useScrollInhibitor(true)
    const data = usePitchIndicator()
    const ref = useRef<HTMLDivElement>(null)

    const containerStyle: React.CSSProperties = props.standalone
        ? { position: "absolute", width: "100%", height: "100%" }
        : { position: "relative" }


    return (
        <div ref={ref} style={containerStyle}>
            <FlexCenter>
                <PitchIndicatorGraphic pitch={data.pitch} />
            </FlexCenter>
        </div>
    )
}

export default PitchIndicator
export { PitchIndicator }