import { useState } from "react"
import { FlexCenter } from "@/components/layout"
import { useDarkMode } from "@/components/theme-provider"

import { useRollIndicator, useRollResizer } from "./hooks"

// Assets
import rollArcCenter from "@/assets/roll-indicator/roll-arc-centre.svg"
import rollArc from "@/assets/roll-indicator/roll-arc.svg"
import rollIndicator from "@/assets/roll-indicator/roll-indicator.svg"
import aircraftFrontAspect from "@/assets/aircraft/gluxe/front-aspect.svg"
import aircraftRearAspect from "@/assets/aircraft/gluxe/rear-aspect.svg"
import { useScrollInhibitor } from "@/hooks"

const RollIndicatorSvgText = ({ roll, widthOrHeight }: { roll: number | undefined, widthOrHeight: { [key: string]: number } }) => {
    const darkMode = useDarkMode()

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

    const darkMode = useDarkMode()

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
            ? <img src={rollArcCenter} style={{ ...getStyle(0) }}></img>
            : <></>
    }

    const RollArc = () => {
        if (props.roll === undefined) return <></>
        return <img src={rollArc} style={{ ...getStyle(0), filter: filter }}></img>
    }

    const RollIndicator = () => {
        if (props.roll === undefined) return <></>
        let r = props.roll
        if (!props.fwdAspect) {
            r = -r
        }
        return <img src={rollIndicator} style={{ ...getStyle(r), filter: indicatorFilter() }}></img>
    }

    const GluxeImage = () => {
        let r = 0
        if (props.roll !== undefined) {
            r = props.roll
        }
        
        if (!props.fwdAspect) {
            r = -r
        }

        const image = props.fwdAspect ? aircraftFrontAspect : aircraftRearAspect
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
    useScrollInhibitor(true)
    const [ref, widthOrHeight] = useRollResizer()
    const [fwdAspect, setFwdAspect] = useState(false)

    const containerStyle: React.CSSProperties = props.standalone
        ? { position: "absolute", left: 0, width: "100%", height: "100%" }
        : { position: "relative", }


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