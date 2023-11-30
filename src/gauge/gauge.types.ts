interface GaugeConfig {
    parameter: string,
    longName?: string,
    units?: string,
    value: number | null,
    min: number,
    max: number,
    dangerBelow?: number | null,
    dangerAbove?: number | null,
}

interface GaugePanelProps {
    configs: Array<GaugeConfig>,
    direction: "row" | "column",
}

export type { GaugeConfig, GaugePanelProps }