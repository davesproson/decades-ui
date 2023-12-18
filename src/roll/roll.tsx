import "../../assets/css/no-scroll.css"
import { useDarkMode } from "../hooks"

import { useRollIndicator, useRollResizer } from "./hooks"

const RollIndicatorSvgText = ({roll, widthOrHeight}: {roll: number, widthOrHeight: {[key: string]: number}}) => {
    const [darkMode, _setDarkMode] = useDarkMode()

    const containerStyle: React.CSSProperties = {
        position: "absolute",
        ...widthOrHeight
    }
    const color = darkMode ? "white" : "black"
    return (
        <div style={containerStyle}>
            <svg  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 400 400"  {...widthOrHeight}>
                <text x="200" y="320" fill={color} textAnchor="middle" fontSize={"3em"}>{Math.abs(Math.floor(roll))}</text>
            </svg>
        </div>
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
            transform: `rotate(${rotation}deg)`,
            ...props.widthOrHeight,
        }
    }

    const dmFilter = "invert(63%) sepia(2%) saturate(13%) hue-rotate(331deg) brightness(86%) contrast(79%)"
    const greenFilter = "invert(36%) sepia(96%) saturate(2933%) hue-rotate(101deg) brightness(104%) contrast(102%)"
    
    const filter = darkMode ? dmFilter : ""
    const indicatorFilter = darkMode
        ? Math.abs(props.roll) < 5
            ? greenFilter
            : dmFilter
        : Math.abs(props.roll) < 5
            ? greenFilter
            : "none"

    const CenterIndicator = () => Math.abs(props.roll) < 5
        ? <img src="roll/roll-arc-centre.svg" style={{...getStyle(0)}}></img>
        : <></>

    return (
        <>
            <img src="roll/roll-arc.svg" style={{...getStyle(0), filter: filter}}></img>
            <CenterIndicator />
            <img src="roll/roll-indicator.svg" style={{...getStyle(props.roll), filter: indicatorFilter}}></img>
            <img src="gluxe-front.svg" style={{...getStyle(props.roll), filter: filter}}></img>
            <RollIndicatorSvgText roll={props.roll} widthOrHeight={props.widthOrHeight} />
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
        ? { position: "absolute", top: "50%", left: 0, width: "100%", height: "100%" }
        : { position: "relative", top: "50%" }


    return (
        <div ref={ref} style={containerStyle}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            <RollIndicatorGraphic
                roll={-data.roll}
                widthOrHeight={widthOrHeight} />
                </div>
        </div>
    )
}

export default RollIndicator
export { RollIndicator }
