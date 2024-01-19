import { useEffect, useState } from "react"
import { getData } from "../plot/plotUtils"
import { badData } from "../settings"

const usePitchIndicator = () => {
    const [pitch, setPitch] = useState<number|undefined>(0)

    useEffect(() => {
        const params = ["gin_pitch"]
        const interval = setInterval(() => {
            if(!(document.visibilityState === "visible")) return
            getData({ params: params }).then(data => {
                const r = data["gin_pitch"].filter(x => x !== badData).reverse()[0]
                setPitch(r)
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [setPitch])

    return { pitch: pitch }
}



export { usePitchIndicator }