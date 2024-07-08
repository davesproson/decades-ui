import { useSelector, useDispatch } from '../redux/store'
import { setCustomTimeframe } from '../redux/optionsSlice'
import { Button } from '../components/buttons'
import { FadeOut } from '../components/fadeout'
import { Container } from '../components/container'
import { LiveDataOnly, QuicklookOnly } from '../quicklook'
import { TimeframeInfoBox } from './timeframeInfoBox'
import { TimePicker } from './timepicker'
import { FlightSummarySelector } from './flightsummary'


const TimeFrameSelectorBox = () => {
    const quicklookMode = useSelector(state => state.config.quickLookMode)
    const dataTimeSpan = useSelector(state => state.quicklook.dataTimeSpan)
    const dispatch = useDispatch()

    const resetTimeframe = () => {
        if(!quicklookMode) return
        if(!dataTimeSpan) return
        dispatch(setCustomTimeframe(dataTimeSpan))
    }

    return (
        <nav className="panel mt-4 is-dark">
                <p className="panel-heading">
                    Select a timeframe
                </p>
                <QuicklookOnly>
                    <Button extraClasses='m-2' onClick={resetTimeframe}>Reset to entire dataset</Button>
                </QuicklookOnly>
                <div className="columns">
                    <div className="column is-6">
                        <TimePicker title="Start Time" boundary="start"/>
                    </div>
                    <div className="column is-6">
                        <TimePicker title="End Time" allowOngoing={true && !quicklookMode} boundary="end"/>
                    </div>
                </div>
            </nav>
    )
}

const TimeframeSelector = () => {
    return (
        <FadeOut>
            <Container fixedNav>
                <TimeframeInfoBox />
                <TimeFrameSelectorBox />
                <LiveDataOnly>
                    <FlightSummarySelector />
                </LiveDataOnly>
            </Container>
        </FadeOut>
    )
}

export default TimeframeSelector