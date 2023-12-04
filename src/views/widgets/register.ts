import AlarmList from '../../alarms/alarm';
import Timers from '../../timers/timer';
import PlotDispatcher from '../../plot/plot';
import Tephigram from '../../tephigram/tephigram';
import { PlotURLOptions } from '../../plot/plot.types';
import { TephigramOptions } from '../../tephigram/tephigram.types'
import { DashboardProps } from '../../dashboard/dashboard.types';
import { TimerConfig } from '../../timers/timers.types';
import { GaugePanel } from '../../gauge/gauge';
import { HeadingIndicator } from '../../heading/heading';
import { Dashboard } from '../../dashboard/dashboard';

import { useViewWidget } from './viewWidget';
import { usePlotWidget } from './plotWidget';
import { useDashWidget } from './dashWidget';
import { useTephiWidget } from './tephigramWidget';
import { useGaugeWidget } from './gaugeWidget';
import { useHeadingWidget } from './headingWidget';
import { useMapWidget, MapView } from './mapWidget';
import { useAlarmsWidget } from './alarmsWidget';
import { useTimersWidget } from './timersWidget';

import { RegistryType, WidgetConfiguration, PluginType } from './widgets.types';

/**
 * A utility class for registering widgets
 */
class Registry implements RegistryType<WidgetConfiguration> {
    registered: WidgetConfiguration[] = []
    register(widget: WidgetConfiguration) {
        if (this.registered.find(x => x.type.toLowerCase() === widget.type.toLowerCase())) {
            return
        }
        this.registered.push(widget)
    }
}

// A helper style which may need to be applied to the container of the widget
const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative"
}


// A map of the widget types to the widget components, potentially
// with some extra props. Plugin components should be listed here
const Plugins: PluginType = {
    'plot': (props: PlotURLOptions) => PlotDispatcher({ ...props, containerStyle: containerStyle }),
    'tephi': (props: TephigramOptions) => Tephigram({ ...props, containerStyle: containerStyle }),
    'dashboard': (props: DashboardProps) => Dashboard({ ...props, useURL: false }),
    'map': MapView,
    'alarms': AlarmList,
    'timers': (props: { initialTimers: Array<TimerConfig> }) => Timers(props),
    'gauge': (props: any) => GaugePanel({ ...props }),
    'heading': HeadingIndicator
}


// A hook which registers all the widgets and returns the registry
const useWidgets = () => {
    const registry = new Registry()

    useViewWidget(registry)
    usePlotWidget(registry)
    useDashWidget(registry)
    useTephiWidget(registry)
    useGaugeWidget(registry)
    useHeadingWidget(registry)
    useMapWidget(registry)
    useAlarmsWidget(registry)
    useTimersWidget(registry)

    return registry
}

export { Plugins, useWidgets }