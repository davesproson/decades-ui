import { useEffect, useState } from "react"
import { usePollingData } from "@/data/hooks"
import { badData } from "@/settings"

const usePitchIndicator = () => {
    const [pitch, setPitch] = useState<number | undefined>(0)

    const { data } = usePollingData({ params: ["gin_pitch"] })

    useEffect(() => {
        if (!data) return
        const r = data["gin_pitch"].filter(x => x !== badData).reverse()[0]
        setPitch(r)
    }, [data])

    return { pitch: pitch }
}



export { usePitchIndicator }