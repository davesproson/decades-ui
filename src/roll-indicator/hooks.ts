import { useEffect, useRef, useState } from "react"
import { getData } from "@/data/utils"
import { badData } from "@/settings"

const useRollIndicator = () => {
    const [roll, setRoll] = useState<number | undefined>(0)

    useEffect(() => {
        const params = ["gin_roll"]
        const interval = setInterval(() => {
            if (!(document.visibilityState === "visible")) return
            getData({ params: params }).then(data => {
                const r = data["gin_roll"].filter(x => x !== badData).reverse()[0]
                setRoll(r)
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [setRoll])

    return { roll }
}

const useRollResizer = (): [React.RefObject<HTMLDivElement>, { [key: string]: number }] => {
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

export { useRollIndicator, useRollResizer }