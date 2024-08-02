import { useSelector } from "@/redux/store";

const When = ({condition, children}: {condition: boolean, children: React.ReactNode}) => {
    return condition ? <>{children}</> : null;
}

const Unless = ({condition, children}: {condition: boolean, children: React.ReactNode}) => {
    return condition ? null : <>{children}</>;
}

const Show = ({when, unless, children}: {when?: boolean, unless?:  boolean, children: React.ReactNode}) => {
    if((when !== undefined) && (unless !== undefined)) {
        throw new Error("Show component can't have both 'when' and 'unless' props set to true")
    }
    if(when !== undefined) {
        return <When condition={when}>{children}</When>
    }
    if(unless !== undefined) {
        return <Unless condition={unless}>{children}</Unless>
    }

    throw new Error("Show component must have either 'when' or 'unless' prop set")
}

const QuicklookOnly = (props: ChildProps) => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)

    if (quickLookMode)
        return props.children

    return <></>

}

type ChildProps = {
    children: React.ReactNode
}
const LiveDataOnly = (props: ChildProps) => {
    const quickLookMode = useSelector(state => state.config.quickLookMode)

    if (!quickLookMode)
        return props.children

    return <></>

}

export { Show, When, Unless, LiveDataOnly, QuicklookOnly }