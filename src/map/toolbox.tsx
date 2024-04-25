import { Button } from "../components/buttons"
import { OverlayBox } from "./overlayBox"

const ToolBoxSection = ({title, children}: {title: string, children: React.ReactNode}) => (
    <div>
        <h3>{title}</h3>
        <div className="is-flex">
            {children}
        </div>
    </div>
)

const ToolBoxTitle = () => (
    <h2 className="title is-4">Toolbox</h2>
)

const Toolbox = ({show}: {show: boolean}) => {
    const style = {
        right: 10,
        bottom: 50,
        height: 400,
        width: 350,
    }

    const buttonOpts = {
        extraClasses: "is-flex is-flex-grow-1 m-1",
        small: true
    }

    return (
        <OverlayBox show={show} {...style}>
            <ToolBoxTitle />
            <ToolBoxSection title="Flags">
                <Button.Info {...buttonOpts}>Drop</Button.Info>
                <Button.Success {...buttonOpts}>Add</Button.Success>
                <Button.Danger {...buttonOpts}>Remove</Button.Danger>
            </ToolBoxSection>
            <ToolBoxSection title="Measure">
                <Button.Info {...buttonOpts}>From 146</Button.Info>
                <Button.Info {...buttonOpts}>Line</Button.Info>
                <Button.Danger {...buttonOpts}>Clear</Button.Danger>
            </ToolBoxSection>
            <ToolBoxSection title="Wind">
                <Button.Info {...buttonOpts}>Vane</Button.Info>
                <Button.Info {...buttonOpts}>Drop Drifters</Button.Info>
                <Button.Danger {...buttonOpts}>Clear Drifters</Button.Danger>
            </ToolBoxSection>
            <ToolBoxSection title="Draw">
                <Button.Info {...buttonOpts}>Line</Button.Info>
                <Button.Info {...buttonOpts}>Circle</Button.Info>
                <Button.Info {...buttonOpts}>Polygon</Button.Info>
                <Button.Danger {...buttonOpts}>Clear</Button.Danger>
            </ToolBoxSection>
        </OverlayBox>
    )
}

export { Toolbox }