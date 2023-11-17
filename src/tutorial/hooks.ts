import { useEffect } from "react"
import { useDispatch } from "../redux/store"

const useTutorialAction = (
        // The horror of this typing is due to the way that InferProps works
        // with functional types. I think.
        action: ((...args: any[])=>any) | undefined | null,
        dispatched: Array<((...args: any[])=>any) | null | undefined> | undefined | null,
        clear: Array<((...args: any[])=>any) | null | undefined> | undefined | null,
    ) => {

    const dispatch = useDispatch()
    if(!action) action = () => {}
    useEffect(action, [])
    useEffect(() => {
        if(!dispatched?.length) return
        for(let d of dispatched) {
            if(!d) continue
            dispatch(d())
        }
        return () => {
            if(!clear?.length) return
            for(let c of clear) {
                if(!c) continue
                dispatch(c())
            }
        }
    }, [])
}

export { useTutorialAction }