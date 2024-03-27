import { Suspense, useEffect, useState } from "react"
import { Splash } from "./layout"
import { BrandLogo } from "./branding"

interface LoaderProps {
    text: string,
    value?: number,
    max?: number
}

interface SuspenseLoaderProps {
    text?: string,
    children: React.ReactNode
}

/**
 * Returns a progress bar with a value and max value
 * 
 * @param props
 * @param props.value - the current value of the progress bar
 * @param props.max - the maximum value of the progress bar
 *
 * @returns a progress bar
 */
const ProgressBar = (props: { value: number, max: number }) => {
    return (
        <progress className="progress" style={{
            width: "50%"
        }} value={props.value} max={props.max}>{props.value}</progress>
    )
}

/**
 * Returns a loader with a brand logo and a progress bar
 * 
 * @param props
 * @param props.text - the text to display on the loader
 * @param props.value - the current value of the progress bar
 * @param props.max - the maximum value of the progress bar
 *
 * @returns a loader
 */
const Loader = (props: LoaderProps) => {
    return (
        <Splash>
            <BrandLogo text={props.text} />
            <ProgressBar value={props.value || 0} max={props.max || 100} />
        </Splash>
    )
}


/**
 * Returns a suspense loader with a loader and a fallback. The fallback is a loader with a text prop
 * which defaults to "Loading..." and is displayed after 200ms
 * 
 * @param props
 * @param props.text - the text to display on the loader
 * @param props.children - the children to display
 * 
 * @returns a suspense loader
 */
const SuspenseLoader = (props: SuspenseLoaderProps) => {
    const [showLoader, setShowLoader] = useState(false)

    // Show loader after 200ms. This is to prevent the loader from flashing 
    // on the screen if the content loads quickly
    useEffect(() => {
        const timeout = setTimeout(() => setShowLoader(true), 200)
        return () => clearTimeout(timeout)
    }, [])

    // If enough time has passed, show the loader, otherwise show nothing
    const fallback = showLoader
        ? <Loader text={props.text || "Loading..."} />
        : null

    // Show the children if they are ready, otherwise show the fallback
    return (
        <Suspense fallback={fallback}>
            {props.children}
        </Suspense>
    )
}

export { Loader, SuspenseLoader }