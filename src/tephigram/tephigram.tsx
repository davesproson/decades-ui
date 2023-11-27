import { useRef } from "react";
import { useTephigram } from "./hooks";

interface TephigramProps {
    class?: string
    containerStyle?: React.CSSProperties
}
const Tephigram = (props: TephigramProps) => {
    
    const ref = useRef<HTMLDivElement>(null)
    useTephigram(ref)

    const style = props.containerStyle || {top: 0, left: 0, right: 0, bottom: 0, position: 'absolute'}

    return (
        <div className={props.class} ref={ref} style={style}></div>
    )
}

export default Tephigram