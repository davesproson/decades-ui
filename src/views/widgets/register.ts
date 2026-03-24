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
    private _registered: Array<{ config: WidgetConfiguration, order: number }> = []

    get registered(): Array<WidgetConfiguration> {
        return [...this._registered]
            .sort((a, b) => a.order - b.order)
            .map(x => x.config)
    }

    getWidget(type: string) {
        const w = this._registered.find(x => x.config.type.toLowerCase() === type.toLowerCase())
        if (w) return w.config
        throw new Error(`Widget ${type} not found`)
    }

    findWidget(type: string) {
        return this._registered.find(x => x.config.type.toLowerCase() === type.toLowerCase())?.config
    }

    register(widget: WidgetConfiguration, order = Infinity) {
        if (this._registered.find(x => x.config.type.toLowerCase() === widget.type.toLowerCase())) {
            return
        }
        this._registered.push({ config: widget, order })
    }
}

const registry = new Registry()

// Static widgets have no React hook dependencies and are registered once at
// module load time, before any component renders.
registry.register(tephiWidgetConfig, 40)
registry.register(mapWidgetConfig, 50)
if (chatWidgetConfig) registry.register(chatWidgetConfig, 60)
registry.register(headingWidgetConfig, 90)
registry.register(rollWidgetConfig, 100)
registry.register(pitchWidgetConfig, 110)
registry.register(flightSummaryWidgetConfig, 120)
registry.register(clockWidgetConfig, 130)
registry.register(timersWidgetConfig, 140)

// A hook which registers the remaining widgets — those that use useRef to
// wire a config dialog component to its save callback — and returns the registry.
const useWidgets = () => {
    usePlotWidget(registry, 10)
    useDashWidget(registry, 20)
    useViewWidget(registry, 30)
    useGaugeWidget(registry, 70)
    useAlarmsWidget(registry, 80)

    return registry
}

export { useWidgets }
