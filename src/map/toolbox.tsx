import { Button } from "../components/buttons"
import { OverlayBox } from "./overlayBox"

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
            <h2 className="title is-4">Toolbox</h2>
            <h3>Flags</h3>
            <div className="is-flex">
                <Button.Info {...buttonOpts}>Drop</Button.Info>
                <Button.Success {...buttonOpts}>Add</Button.Success>
                <Button.Danger {...buttonOpts}>Remove</Button.Danger>
            </div>
            <h3 className="mt-2">Measure</h3>
            <div className="is-flex">
                <Button.Info {...buttonOpts}>From 146</Button.Info>
                <Button.Info {...buttonOpts}>Line</Button.Info>
                <Button.Danger {...buttonOpts}>Clear</Button.Danger>
            </div>
            <h3 className="mt-2">Wind</h3>
            <div className="is-flex">
                <Button.Info {...buttonOpts}>Vane</Button.Info>
                <Button.Info {...buttonOpts}>Drop Drifters</Button.Info>
                <Button.Danger {...buttonOpts}>Clear Drifters</Button.Danger>
            </div>

            <h3 className="mt-2">Draw</h3>
            <div className="is-flex">
                <Button.Info {...buttonOpts}>Line</Button.Info>
                <Button.Info {...buttonOpts}>Circle</Button.Info>
                <Button.Info {...buttonOpts}>Polygon</Button.Info>
                <Button.Danger {...buttonOpts}>Clear</Button.Danger>
            </div>
        </OverlayBox>
    )
}

export { Toolbox }