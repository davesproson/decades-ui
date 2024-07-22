import Loader from "@/components/loader"
import { useDispatchParameters } from "@/hooks"
import { useSelector } from "@/redux/store"


export const ParameterDispatcher = ({children}: {children: React.ReactNode}) => {
    useDispatchParameters()
    const paramsDispatched = useSelector(state => state.vars.paramsDispatched)

    if (!paramsDispatched) {
        return (
            <div className="fixed inset-0 flex justify-center items-center">
                <Loader />
            </div>
        )
    }

    return <>{children}</>
}