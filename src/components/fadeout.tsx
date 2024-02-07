import { useBrainFade } from "../hooks";

interface FaderProps {
    children: React.ReactNode
}

/**
 * A component that fades out its children when it is unmounted.
 * 
 * @component
 * @example
 * return (
 *  <FadeOut>
 *     <div>Some content</div>
 * </FadeOut>
 * )
 */
const FadeOut = (props: FaderProps) => {
    const ref = useBrainFade<HTMLDivElement>()

    return (
        <div ref={ref} className="disappear">
            {props.children}
        </div>
    )
}

export { FadeOut }