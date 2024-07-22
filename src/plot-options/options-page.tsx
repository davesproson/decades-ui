import Navbar from '@/navbar';
import { DecadesBreadCrumb } from '@/components/ui/breadcrumb';
import { PlotOptions } from './plot-options';
import { AxisSelectionCard } from './axis-selection';
import { AxisScalingCard } from './axis-scaling';
import { ParameterDispatcher } from '@/parameters/parameter-dispatcher';

const PlotOptionsPage = () => {

    return (
        <Navbar>
            <ParameterDispatcher>
                <DecadesBreadCrumb crumbs={[
                    { label: 'Plot Options' }
                ]} />
                <PlotOptions />
                <AxisSelectionCard />
                <AxisScalingCard />
            </ParameterDispatcher>
        </Navbar>
    )
}

export { PlotOptionsPage }