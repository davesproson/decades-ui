import { useEffect, useRef, useState } from "react"
import { getData } from "@/data/utils"
import { badData } from "@/settings"

const useHeadingIndicator = () => {
    const [heading, setHeading] = useState<number | undefined>(90)
    const [trackAngle, setTrackAngle] = useState<number | undefined>(95)
    const [windAngle, setWindAngle] = useState<number | undefined>(30)

    useEffect(() => {
        const params = ["gin_heading", "gin_track_angle", "adc_wind_angle"]
        const interval = setInterval(() => {
            if (!(document.visibilityState === "visible")) return
            getData({ params: params }).then(data => {
                const h = data["gin_heading"].filter(x => x !== badData).reverse()[0]
                const t = data["gin_track_angle"].filter(x => x !== badData).reverse()[0]
                const w = data["adc_wind_angle"].filter(x => x !== badData).reverse()[0]
                setHeading(h)
                setTrackAngle(t)
                setWindAngle(w)
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [setHeading, setTrackAngle, setWindAngle])

    return { heading, trackAngle, windAngle }
}

const useHeadingResizer = (): [React.RefObject<HTMLDivElement>, { [key: string]: number }] => {
    const ref = useRef<HTMLDivElement>(null)
    const [widthOrHeight, setWidthOrHeight] = useState<{ [key: string]: number }>({ width: 0 })

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect
            if (width > height) {
                setWidthOrHeight({ height: height })
            } else {
                setWidthOrHeight({ width: width })
            }
        })
        if (ref.current) {
            resizeObserver.observe(ref.current)
        }
        return () => {
            resizeObserver.disconnect()
        }
    }, [ref, setWidthOrHeight])

    return [ref, widthOrHeight]
}

export { useHeadingIndicator, useHeadingResizer }