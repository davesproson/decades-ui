import { useDarkMode } from "@/components/theme-provider"
import { GaugeConfig, GaugePanelProps } from "./types"
import { useGauge } from "./hooks"
import { badData } from "@/settings"

const CX = 100, CY = 95, R = 72, STROKE_WIDTH = 16, VALUE_STROKE_WIDTH = 10

const polarToCartesian = (angle: number) => ({
    x: CX + R * Math.cos(angle),
    y: CY - R * Math.sin(angle)
})

const arcPath = (startAngle: number, endAngle: number): string => {
    const span = startAngle - endAngle
    if (span <= 0) return ''
    const start = polarToCartesian(startAngle)
    const end = polarToCartesian(endAngle)
    const largeArc = span >= Math.PI ? 1 : 0
    return `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

const Gauge = (props: GaugeConfig) => {
    const darkMode = useDarkMode()

    const min = props.min ?? 0
    const max = props.max ?? 100
    const value = props.value === badData ? null : props.value

    const toAngle = (v: number) => Math.PI * (1 - (v - min) / (max - min))

    const normalised = value !== null
        ? Math.max(0, Math.min(1, (value - min) / (max - min)))
        : null

    const inDanger = value !== null && (
        (props.dangerBelow != null && value < props.dangerBelow) ||
        (props.dangerAbove != null && value > props.dangerAbove)
    )

    const trackColor = darkMode ? '#333333' : '#e0e0e0'
    const valueColor = inDanger ? '#770000' : '#0abbef'
    const textColor = value === null ? '#cc0000'
        : inDanger ? '#aa0000'
        : darkMode ? '#d4d4d4' : '#111111'
    const bgColor = darkMode ? '#0a0a0a' : 'white'

    const title = `${props.longName || props.parameter} (${props.units || "?"})`
    const displayValue = value !== null ? value.toFixed(1) : '---'

    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 138"
            style={{ display: 'block', background: bgColor }}
        >
                {/* Background track */}
                <path
                    d={arcPath(Math.PI, 0)}
                    fill="none" stroke={trackColor}
                    strokeWidth={STROKE_WIDTH} strokeLinecap="round"
                />
                {/* Danger zones — flat inner cap, rounded outer cap via circle */}
                {props.dangerBelow != null && props.dangerBelow > min && (
                    <>
                        <path
                            d={arcPath(Math.PI, toAngle(props.dangerBelow))}
                            fill="none" stroke="#aa0000"
                            strokeWidth={STROKE_WIDTH} strokeLinecap="butt"
                        />
                        <circle cx={CX - R} cy={CY} r={STROKE_WIDTH / 2} fill="#aa0000" />
                    </>
                )}
                {props.dangerAbove != null && props.dangerAbove < max && (
                    <>
                        <path
                            d={arcPath(toAngle(props.dangerAbove), 0)}
                            fill="none" stroke="#aa0000"
                            strokeWidth={STROKE_WIDTH} strokeLinecap="butt"
                        />
                        <circle cx={CX + R} cy={CY} r={STROKE_WIDTH / 2} fill="#aa0000" />
                    </>
                )}
                {/* Value arc — narrower so danger zones show through */}
                {normalised !== null && normalised > 0 && (
                    <path
                        d={arcPath(Math.PI, Math.PI * (1 - normalised))}
                        fill="none" stroke={valueColor}
                        strokeWidth={VALUE_STROKE_WIDTH} strokeLinecap="round"
                    />
                )}
                {/* Numeric value */}
                <text x={CX} y={CY - 5} textAnchor="middle" fontSize="26" fontWeight="bold" fill={textColor}>
                    {displayValue}
                </text>
                {/* Range labels — aligned with arc endpoints */}
                <text x={CX - R} y={CY + 22} textAnchor="middle" fontSize="11" fill={textColor}>
                    {min}
                </text>
                <text x={CX + R} y={CY + 22} textAnchor="middle" fontSize="11" fill={textColor}>
                    {max}
                </text>
                {/* Title */}
                <text x={CX} y={132} textAnchor="middle" fontSize="10" fill={textColor}>
                    {title}
                </text>
            </svg>
    )
}

const GaugePanel = (props: GaugePanelProps) => {

    const configs = useGauge(props.configs || [])

    if (!configs) return <></>

    let direction = props.direction || "row"

    if (direction === "row") {
        var templateColumns = "1fr ".repeat(configs.length)
        var templateRows = "1fr"
    } else {
        var templateColumns = "1fr"
        var templateRows = "1fr ".repeat(configs.length)
    }

    return (
        <div style={{
            position: "relative",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
        }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: templateColumns,
                gridTemplateRows: templateRows,
                height: "100%",
                width: "100%",
            }}>
                {configs.map((config, i) => <Gauge key={i} {...config} />)}
            </div>
        </div>
    )
}

const GaugePanelDispatcher = () => {
    return <GaugePanel configs={[]} direction="row" />
}

export default GaugePanelDispatcher
export { GaugePanel }
