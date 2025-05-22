import { useRef } from "react";
import { useTephigram } from "./hooks";
import { TephigramSearchParams } from "@/routes/tephigram";

interface TephigramProps {
    class?: string
    containerStyle?: React.CSSProperties
    tephiOptions?: TephigramSearchParams
}
const Tephigram = (props: TephigramProps) => {

    const ref = useRef<HTMLDivElement>(null)
    useTephigram(ref, props.tephiOptions)

    const style = props.containerStyle || { top: 0, left: 0, right: 0, bottom: 0, position: 'absolute' }

    return (
        <div className={props.class} ref={ref} style={style}></div>
    )
}

export default Tephigram