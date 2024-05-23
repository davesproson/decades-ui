import { Tag } from "../components/tags"

interface OptionProps {
    title: string,
    tag?: {
        text: string,
        is: string,
    }
    children?: any
}
export const Option = (props: OptionProps) => {
    return (
        <li className="mt-2 mb-4">
            <div className="mb-2">
                {props.title} {props.tag ? <Tag {...props.tag} /> : null}
            </div>
            {props.children}
        </li>
    )
}

interface OptionListProps {
    children: any
}
export const OptionList = (props: OptionListProps) => {
    return (
        <ul className="">
            {props.children}
        </ul>
    )
}