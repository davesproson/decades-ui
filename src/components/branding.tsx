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
const BrandLogo = ({text}: BrandLogoProps) => {
    const TextElement = () => text 
        ? <div className="is-size-4">{text}</div> 
        : null

    return (
        <>
            <img src={"faam-logo.svg"} alt="Logo" />
            <TextElement />    
        </>
    )
}

export { BrandLogo }