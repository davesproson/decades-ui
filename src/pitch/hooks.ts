import { useEffect, useRef, useState } from "react"
import { getData } from "../plot/plotUtils"
import { badData } from "../settings"

const usePitchIndicator = () => {
    const [pitch, setPitch] = useState(0)

    useEffect(() => {
        const params = ["gin_pitch"]
        const interval = setInterval(() => {
            getData({ params: params }).then(data => {
                const r = data["gin_pitch"].filter(x => x !== badData).reverse()[0]
                if (r === undefined) return
                setPitch(r)
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [setPitch])

    return { pitch: pitch }
}

const usePitchResizer = (): [React.RefObject<HTMLDivElement>, {[key: string]: number}] => {
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

export { usePitchIndicator, usePitchResizer }