
const Spaced = (props: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-row justify-between h-full m-auto">
            <h1>{props.children}</h1>
        </div>
    );
}

const SpacedText = (props: { text: string }) => {
    return props.text.split('').map((c, i) => <Spaced key={i}>{c}</Spaced>);

}

const DecadesBanner = ({ text }: { text?: string }) => {
    return (
        <div className="flex flex-row gap-[10px] h-[100px] w-full justify-around items-center p-[0.5em]">
            <div className="flex w-full justify-around fixed max-w-[80%]">
                <SpacedText text={text || "DECADES"} />
            </div>
        </div>
    );
}

export { DecadesBanner }