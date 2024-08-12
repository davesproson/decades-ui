import { useEffect, useState } from 'react'
import { PlaneIcon, Cog as ProgressIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const transformText = (text?: string) => {
    if (!text) return ""
    return text.toUpperCase().split('').join(" ")
}

const ProgressBar = ({progressPercent}: {progressPercent?: number}) => (progressPercent !== undefined)
    ? <Progress className="mt-6 w-[50%]" value={progressPercent} max={100} />
    : null

    const LoaderText = ({text}: {text: string}) => {
        const words = text.split(' ')
        return (
            <div className="flex">
                {words.map((x, i)=>{
                    return <span key={i} className="mr-2 ml-2">{transformText(x)}</span>
                })}
            </div>
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
const CogLoader = ({ text, progressPercent }: { text?: string, progressPercent?: number }) => {

    const [value, setValue] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setValue((prev) => (prev + 2))
        }, 20)
        return () => clearInterval(interval)
    }, [setValue])

    return (
        <div className="absolute flex flex-col inset-0 justify-center items-center" data-testid="decades-loader">
            <div className="flex flex-row">
                <div style={{ transform: `rotate(${value}deg)` }}>
                    <ProgressIcon size="6em" color="#252243" />
                </div>
                <div style={{ transform: `rotate(${-value + 45}deg)` }}>
                    <ProgressIcon size="6em" color="#0abbef" />
                </div>
            </div>
            <div className="mb-3 w-100 text-[2em]">D E C A D E S</div>
            <LoaderText text={text || "LOADING"}/>
            <ProgressBar progressPercent={progressPercent}/>
        </div>
    )
}

const Loader = ({ text, progressPercent }: { text?: string, progressPercent?: number }) => {
    return (
        <div className="absolute flex flex-col inset-0 justify-center items-center" data-testid="decades-loader">
            <div className="flex justify-center w-[50%] animate-slider">
                <PlaneIcon size="6em" color="#252243" style={{
                    rotate: "45deg",
                }} />
            </div>
            <div className="mb-3 w-100 text-[2em]">D E C A D E S</div>
            <LoaderText text={text || "LOADING"} />
            <ProgressBar progressPercent={progressPercent}/>
        </div>
    )
}


export default Loader
export { CogLoader, Loader }