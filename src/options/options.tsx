import { usePlotUrl } from '../plot/hooks';
import { PlotOptionCard } from './plotOptions';
import { AxisSelectionCard, AxisScalingCard } from './axisOptions';
import { Button } from '../components/buttons';
import { useBrainFade } from "../hooks";

const AddressBar = () => {
    const address = usePlotUrl()
    return (
        <div className="field has-addons">
            <div className='control is-flex-grow-1'>
                <input className="input" type="text" value={address?.toString()} readOnly />
            </div>
            <div className='control'>
                <Button.Info onClick={() => {
                    if (address)
                        navigator.clipboard.writeText(address.toString())}
                }>Copy</Button.Info>
            </div>
        </div>
    )
}

const Options = () => {

    const ref = useBrainFade<HTMLDivElement>()

    return (
        <div ref={ref} className="container has-navbar-fixed-top disappear">
            <div className="section">
                <AddressBar />
                <PlotOptionCard />
                <AxisSelectionCard />
                <AxisScalingCard />
            </div>
        </div>
    )
}

export default Options 