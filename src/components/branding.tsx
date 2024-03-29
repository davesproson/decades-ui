type BrandLogoProps = {
    text?: string,
}

/**
 * Returns a brand logo with optional text
 * 
 * @param props
 * @param props.text - the text to display
 * 
 * @returns a brand logo
 */
const BrandLogo = (props: BrandLogoProps) => {
    const TextElement = () => props.text 
        ? <div className="is-size-4">{props.text}</div> 
        : null

    return (
        <>
            <img src={"faam-logo.svg"} alt="Logo" />
            <TextElement />    
        </>
    )
}

export { BrandLogo }