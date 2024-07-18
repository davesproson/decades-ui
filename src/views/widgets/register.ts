import { useViewWidget } from './view-widget';
import { usePlotWidget } from './plot-widget';
import { useDashWidget } from './dash-widget';
import { useTephiWidget } from './tephigram-widget';
import { useGaugeWidget } from './gauge-widget';
import { useHeadingWidget } from './heading-widget';
import { useMapWidget } from './map-widget';
import { useAlarmsWidget } from './alarm-widget';
import { useTimersWidget } from './timers-widget';
import { useRollWidget } from './roll-indicator-widget';
import { usePitchWidget } from './pitch-indicator-widget';
import { useClockWidget } from './clock-widget';
import { useChatWidget } from './chat-widget';
import { useFlightSummaryWidget } from './flight-summary-widget';

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
    useFlightSummaryWidget(registry)


    return registry
}

export { useWidgets }