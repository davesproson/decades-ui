import { useState } from "react"
import "../../assets/css/no-scroll.css"
import { FlexCenter } from "../components/layout"
import { useDarkMode } from "../hooks"

import { useRollIndicator, useRollResizer } from "./hooks"

const RollIndicatorSvgText = ({ roll, widthOrHeight }: { roll: number | undefined, widthOrHeight: { [key: string]: number } }) => {
    const [darkMode, _setDarkMode] = useDarkMode()

    const containerStyle: React.CSSProperties = {
        position: "absolute",
        ...widthOrHeight
    }
    const color = roll === undefined
        ? "red"
        : darkMode ? "white" : "black"

    const rollText = roll === undefined ? "No Data" : Math.abs(Math.floor(roll)).toString()

    return (
        <div style={containerStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"  {...widthOrHeight}>
                <text x="200" y="320" fill={color} textAnchor="middle" fontSize={"3em"}>{rollText}</text>
            </svg>
        </div>
    )
}

interface RollIndicatorGraphicProps {
    roll: number | undefined,
    fwdAspect: boolean,
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

    const indicatorFilter = () => {
        if (props.roll === undefined) return "none"

        return darkMode
            ? Math.abs(props.roll) < 5
                ? greenFilter
                : dmFilter
            : Math.abs(props.roll) < 5
                ? greenFilter
                : "none"
    }

    const CenterIndicator = () => {
        if (props.roll === undefined) return <></>
        return Math.abs(props.roll) < 5
            ? <img src="roll/roll-arc-centre.svg" style={{ ...getStyle(0) }}></img>
            : <></>
    }

    const RollArc = () => {
        if (props.roll === undefined) return <></>
        return <img src="roll/roll-arc.svg" style={{ ...getStyle(0), filter: filter }}></img>
    }

    const RollIndicator = () => {
        if (props.roll === undefined) return <></>
        let r = props.roll
        if (!props.fwdAspect) {
            r = -r
        }
        return <img src="roll/roll-indicator.svg" style={{ ...getStyle(r), filter: indicatorFilter() }}></img>
    }

    const GluxeImage = () => {
        let r = 0
        if (props.roll !== undefined) {
            r = props.roll
        }
        
        if (!props.fwdAspect) {
            r = -r
        }

        const image = props.fwdAspect ? "gluxe-front.svg" : "gluxe-rear.svg"
        return <img src={image} style={{ ...getStyle(r), filter: filter }}></img>
    }

    return (
        <>
            <RollArc />
            <CenterIndicator />
            <RollIndicator />
            <GluxeImage />
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
    const [fwdAspect, setFwdAspect] = useState(true)

    const containerStyle: React.CSSProperties = props.standalone
        ? { position: "absolute", top: "50%", left: 0, width: "100%", height: "100%" }
        : { position: "relative", top: "50%" }


    const castRoll = (roll: number | undefined): number | undefined => {
        if (roll === undefined) return undefined
        return -roll
    }

    return (
        <div ref={ref} style={containerStyle} onClick={()=>setFwdAspect(x=>!x)}>
            <FlexCenter>
                <RollIndicatorGraphic
                    roll={castRoll(data.roll)}
                    fwdAspect={fwdAspect}
                    widthOrHeight={widthOrHeight} />
            </FlexCenter>
        </div>
    )
}

export default RollIndicator
export { RollIndicator }
