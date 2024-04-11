import { useViewWidget } from './viewWidget';
import { usePlotWidget } from './plotWidget';
import { useDashWidget } from './dashWidget';
import { useTephiWidget } from './tephigramWidget';
import { useGaugeWidget } from './gaugeWidget';
import { useHeadingWidget } from './headingWidget';
import { useMapWidget } from './mapWidget';
import { useAlarmsWidget } from './alarmsWidget';
import { useTimersWidget } from './timersWidget';
import { useRollWidget } from './rollWidget';
import { usePitchWidget } from './pitchWidget';
import { useClockWidget } from './clockWidget';

import { RegistryType, WidgetConfiguration } from './widgets.types';
import { useChatWidget } from './chatWidget';

/**
 * A utility class for registering widgets
 */
class Registry implements RegistryType<WidgetConfiguration> {
    registered: Array<WidgetConfiguration> = []
    getWidget(type: string) {
        const w = this.registered.find(x => x.type.toLowerCase() === type.toLowerCase())
        if (w) return w
        throw new Error(`Widget ${type} not found`)
    }
    register(widget: WidgetConfiguration) {
        if (this.registered.find(x => x.type.toLowerCase() === widget.type.toLowerCase())) {
            return
        }
        this.registered.push(widget)
    }
}

const registry = new Registry()

// A hook which registers all the widgets and returns the registry
const useWidgets = () => {

    useViewWidget(registry)
    usePlotWidget(registry)
    useDashWidget(registry)
    useTephiWidget(registry)
    useGaugeWidget(registry)
    useHeadingWidget(registry)
    useMapWidget(registry)
    useAlarmsWidget(registry)
    useTimersWidget(registry)
    useRollWidget(registry)
    usePitchWidget(registry)
    useChatWidget(registry)
    useClockWidget(registry)


    return registry
}

export { useWidgets }