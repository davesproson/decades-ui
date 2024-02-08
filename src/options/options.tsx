import { usePlotUrl } from '../plot/hooks';
import { PlotOptionCard } from './plotOptions';
import { AxisSelectionCard, AxisScalingCard } from './axisOptions';
import { Button } from '../components/buttons';
import { Section } from '../components/layout';
import { Control, Field, Input } from '../components/forms';
import { Container } from '../components/container';
import { FadeOut } from '../components/fadeout';

/**
 * Provides a (disabled) input field for the user to copy the current plot URL
 * and a button to copy the URL to the clipboard.
 * 
 */
const AddressBar = () => {
    const address = usePlotUrl()
    return (
        <Field addons>
            <Control extraClasses="is-flex-grow-1">
                <Input type="text" value={address?.toString() || ""} readOnly />
            </Control>
            <Control>
                <Button.Info onClick={() => {
                    if (address)
                        navigator.clipboard.writeText(address.toString())
                }
                }>Copy</Button.Info>
            </Control>
        </Field>
    )
}

/**
 * A component that provides the user with options to customize the plot.
 * 
 * @component
 * @example
 * return (
 *   <Options />
 * )
 */
const Options = () => {

    return (
        <FadeOut>
            <Container fixedNav>
                <Section>
                    <AddressBar />
                    <PlotOptionCard />
                    <AxisSelectionCard />
                    <AxisScalingCard />
                </Section>
            </Container>
        </FadeOut>
    )
}

export default Options 