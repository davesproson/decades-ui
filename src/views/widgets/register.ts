import { useViewWidget } from './view-widget';
import { usePlotWidget } from './plot-widget';
import { useDashWidget } from './dash-widget';
import { useGaugeWidget } from './gauge-widget';
import { useAlarmsWidget } from './alarm-widget';

import { headingWidgetConfig } from './heading-widget';
import { mapWidgetConfig } from './map-widget';
import { rollWidgetConfig } from './roll-indicator-widget';
import { pitchWidgetConfig } from './pitch-indicator-widget';
import { tephiWidgetConfig } from './tephigram-widget';
import { timersWidgetConfig } from './timers-widget';
import { clockWidgetConfig } from './clock-widget';
import { flightSummaryWidgetConfig } from './flight-summary-widget';
import { chatWidgetConfig } from './chat-widget';

import type { RegistryType, WidgetConfiguration } from './types';

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
    findWidget(type: string) {
        return this.registered.find(x => x.type.toLowerCase() === type.toLowerCase())
    }
    register(widget: WidgetConfiguration) {
        if (this.registered.find(x => x.type.toLowerCase() === widget.type.toLowerCase())) {
            return
        }
        this.registered.push(widget)
    }
}

const registry = new Registry()

// Static widgets have no React hook dependencies and are registered once at
// module load time, before any component renders.
registry.register(headingWidgetConfig)
registry.register(mapWidgetConfig)
registry.register(rollWidgetConfig)
registry.register(pitchWidgetConfig)
registry.register(tephiWidgetConfig)
registry.register(timersWidgetConfig)
registry.register(clockWidgetConfig)
registry.register(flightSummaryWidgetConfig)
if (chatWidgetConfig) registry.register(chatWidgetConfig)

// A hook which registers the remaining widgets — those that use useRef to
// wire a config dialog component to its save callback — and returns the registry.
const useWidgets = () => {
    useViewWidget(registry)
    usePlotWidget(registry)
    useDashWidget(registry)
    useGaugeWidget(registry)
    useAlarmsWidget(registry)

    return registry
}

export { useWidgets }
