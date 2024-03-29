import { useScrollInhibitor} from './hooks';
import { useDispatch } from "./redux/store";
import { setQuickLookMode, setModeSelected } from './redux/configSlice';

import { FlexCenter, Spacer } from './components/layout';
import { Button } from './components/buttons';
import { DecadesBanner } from './components/decades';

const MODE_QUICKLOOK = true;
const MODE_LIVEDATA = false;

// Typedefs
type ModeSelectCardProps = {
    title: string,
    children?: React.ReactNode,
    onLaunch?: () => void
}

/**
 * A card that allows the user to select a mode
 * 
 * @param props 
 * @param props.title - the title of the card
 * @param props.children - the children of the card
 * @param props.onLaunch - the function to call when the user clicks the launch button
 * 
 * @returns The mode select card
 */
const ModeSelectCard = (props: ModeSelectCardProps) => {
    return (
        <div style={{ maxWidth: "800px" }}>
            <h1 className="title">{props.title}</h1>
            <h2 className="subtitle">{props.children}</h2>
            <Button.Dark fullWidth outlined onClick={props.onLaunch}>
                Launch
            </Button.Dark>
        </div>
    )
}

/**
 * The mode selector component. This is a full screen component that allows the 
 * user to select between live data and quicklook mode. It dispatches the
 * appropriate actions to the redux store when the user makes a selection.
 * 
 * @returns The mode selector component
 */
export const VistaModeSelector = () => {
    const dispatch = useDispatch()

    // Prevent scrolling while the mode selector is open
    useScrollInhibitor(true)

    /**
     * Set the mode in the redux store to quicklook mode (true) or live data 
     * mode (false)
     * 
     * @param mode - the mode to set. True for quicklook mode, false for live data mode
     */
    const setMode = (mode: boolean) => {
        dispatch(setQuickLookMode(mode))
        dispatch(setModeSelected(true))
    }

    return (
        <div style={{ top: 0, bottom: 0, position: "fixed", left: 0, right: 0 }}>
            <DecadesBanner />

            <div style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }} >

                <FlexCenter direction="column" extraStyle={{ height: "100%" }}>

                    <ModeSelectCard title="Live data" onLaunch={() => setMode(MODE_LIVEDATA)}>
                        <p>
                            View live data from the aircraft, when available, or a demonstration
                            of the system with simulated data otherwise.
                        </p>
                    </ModeSelectCard>

                    <Spacer size={80} />

                    <ModeSelectCard title="Quicklook" onLaunch={() => setMode(MODE_QUICKLOOK)}>
                        <p>
                            View processed data from recent flights. These data typically
                            become available from a few hours to a day after the flight, and remain
                            available for between two and four weeks.
                        </p>
                    </ModeSelectCard>

                </FlexCenter>

            </div>
        </div>
    )
}

export default VistaModeSelector;