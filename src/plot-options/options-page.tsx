import Navbar from '@/navbar';
import { DecadesBreadCrumb } from '@/components/ui/breadcrumb';
import { PlotOptions } from './plot-options';
import { AxisSelectionCard } from './axis-selection';
import { AxisScalingCard } from './axis-scaling';

const PlotOptionsPage = () => {

    return (
        <Navbar>
            <DecadesBreadCrumb crumbs={[
                { label: 'Plot Options' }
            ]} />
            <PlotOptions />
            <AxisSelectionCard />
            <AxisScalingCard />
        </Navbar>
    )
}

export { PlotOptionsPage }