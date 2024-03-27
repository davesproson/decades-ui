import { useScrollInhibitor} from './hooks';
import { useDispatch } from "./redux/store";
import { setQuickLookMode, setModeSelected } from './redux/configSlice';

import { FlexCenter, Spacer } from './components/layout';
import { Button } from './components/buttons';
import { DecadesBanner } from './components/decades';


type ModeSelectCardProps = {
    title: string,
    children?: React.ReactNode,
    onLaunch?: () => void
}
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

export const VistaModeSelector = () => {
    const dispatch = useDispatch()

    useScrollInhibitor(true)

    const setMode = (mode: boolean) => {
        dispatch(setQuickLookMode(mode))
        dispatch(setModeSelected(true))
    }

    return (
        <div style={{ top: 0, bottom: 0, position: "fixed", left: 0, right: 0 }}>
            <DecadesBanner />
            <div style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }} >
                <FlexCenter direction="column" extraStyle={{ height: "100%" }}>
                    <ModeSelectCard title="Live data" onLaunch={() => setMode(false)}>
                        <p>
                            View live data from the aircraft, when available, or a demonstration
                            of the system with simulated data otherwise.
                        </p>
                    </ModeSelectCard>
                    <Spacer size={80} />
                    <ModeSelectCard title="Quicklook" onLaunch={() => setMode(true)}>
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