interface BooleanTagProps {
    value: boolean,
    text?: string
}

interface TagProps {
    text?: string,
    is: string,
    extraClasses?: string
}

/**
 * A tag that displays a boolean value as a green or red tag.
 * 
 * @param props - The props of the component.
 * @param  props.value - The value to be displayed. If true, the tag will 
 *                                 be green, if false, the tag will be red.
 * @param  props.text - The text to be displayed in the tag.
 * 
 * @returns a tag with the text and color corresponding to the value.
 * 
 * @component
 * @example
 * return (
 * <BooleanTag value={true} text="True" />
 * )
 */
export const BooleanTag = ({ value, text }: BooleanTagProps) => {
    const tagClass = value ? "tag is-success" : "tag is-danger"
    if(!text) {
        text = value ? "True" : "False"
    }
    return <span className={tagClass}>{text}</span>
}

/**
 * Renders a tag with the given text and color.
 * 
 * @param props - The props of the component.
 * @param props.text - The text to be displayed in the tag.
 * @param props.is - The color of the tag. Can be any of the colors in Bulma.
 * @param props.extraClasses - Any extra classes to be added to the tag.
 * 
 * @returns A tag with the text and color corresponding to the value.
 * 
 * @component
 * @example
 * return (
 * <Tag text="Tag" is="success" extraClasses="is-light" />
 * )
 */
export const Tag = ({ text, is, extraClasses }: TagProps) => {
    const tagClass = `tag is-${is} ${extraClasses}`
    return <span className={tagClass}>{text}</span>
}

