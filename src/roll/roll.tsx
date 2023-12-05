import "../../assets/css/no-scroll.css"
import { useDarkMode } from "../hooks"

import { useRollIndicator, useRollResizer } from "./hooks"

const RollIndicatorSvgText = ({roll}: {roll: number}) => {
    const containerStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
    }
    return (
        <svg  style={containerStyle} xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">
            <text x="200" y="280" fill="black" textAnchor="left">{Math.floor(roll)}</text>
        </svg>
    )
}

interface RollIndicatorGraphicProps {
    roll: number,
    widthOrHeight: { [key: string]: number }
}
const RollIndicatorGraphic = (props: RollIndicatorGraphicProps) => {

    const [darkMode, _setDarkMode] = useDarkMode()

    const getStyle = (rotation: number): React.CSSProperties => {

        return {
            position: "absolute",
            top: 0,
            left: Object.keys(props.widthOrHeight).includes("width") ? 0 : "25%",
            transform: `rotate(${rotation}deg)`,
            ...props.widthOrHeight
        }
    }

    const filter = darkMode
        ? "invert(63%) sepia(2%) saturate(13%) hue-rotate(331deg) brightness(86%) contrast(79%)"
        : ""

    return (
        <>
            <img src="roll/roll-arc.svg" style={{...getStyle(0), filter: filter}}></img>
            <img src="roll/roll-arc-centre.svg" style={{...getStyle(0)}}></img>
            <img src="roll/roll-indicator.svg" style={{...getStyle(props.roll), filter: filter}}></img>
            <img src="gluxe-front.svg" style={{...getStyle(props.roll), filter: filter}}></img>
            <RollIndicatorSvgText roll={props.roll}/>
        </>
    )
}

interface RollIndicatorProps {
    standalone?: boolean
}
const RollIndicator = (props: RollIndicatorProps) => {
    const data = useRollIndicator()
    const [ref, widthOrHeight] = useRollResizer()

    const containerStyle: React.CSSProperties = props.standalone
        ? { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }
        : { position: "relative" }


    return (
        <div ref={ref} style={containerStyle}>
            <RollIndicatorGraphic
                roll={data.roll}
                widthOrHeight={widthOrHeight} />
        </div>
    )
}

export default RollIndicator
export { RollIndicator }
