
const Spaced = (props: { children: React.ReactNode }) => {
    return (
        <div className="decades-box-h pulsate"><h1>{props.children}</h1></div>
    );
}

const SpacedText = (props: { text: string }) => {
    return props.text.split('').map((c, i) => <Spaced key={i}>{c}</Spaced>);
    
}

const DecadesBanner = () => {
    return (
        <div className="decades-header">
            <div className="decades-header-container max800">
                <SpacedText text="DECADES" />
            </div>
        </div>
    );
}

export { DecadesBanner }