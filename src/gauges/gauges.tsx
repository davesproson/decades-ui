import { useEffect, useRef, useState } from "react"
import { useDarkMode } from "@/components/theme-provider"
import { GaugeConfig, GaugePanelProps } from "./types"
import { useGauge } from "./hooks"
import { badData } from "@/settings"

// SVG coordinate system constants. The gauge arc is a semicircle drawn on
// a 200×138 viewBox. CX/CY is the centre of the circle; R is its radius.
// The two stroke widths differ so the value arc sits visually inside the
// wider danger-zone/track arc, letting danger zones show through.
const CX = 100, CY = 95, R = 72, STROKE_WIDTH = 16, VALUE_STROKE_WIDTH = 10

/**
 * Convert a mathematical angle (radians, measured anti-clockwise from the
 * positive x-axis) to an SVG point on the gauge circle.
 *
 * SVG's y-axis points downward, so the sin term is negated to keep the
 * standard convention where angle=0 is right and angle=π is left.
 */
const polarToCartesian = (angle: number) => ({
    x: CX + R * Math.cos(angle),
    y: CY - R * Math.sin(angle)
})

/**
 * Build an SVG arc path string sweeping clockwise from startAngle to endAngle.
 *
 * The gauge runs from π (left endpoint, minimum) down to 0 (right endpoint,
 * maximum) — i.e. startAngle > endAngle for any visible arc.  Returns an
 * empty string for zero-length or inverted spans so the element can be
 * rendered unconditionally without producing a visible artefact.
 *
 * sweep-flag=1 means clockwise in SVG screen space, which traces the top of
 * the semicircle as expected.
 */
const arcPath = (startAngle: number, endAngle: number): string => {
    const span = startAngle - endAngle
    if (span <= 0) return ''
    const start = polarToCartesian(startAngle)
    const end = polarToCartesian(endAngle)
    const largeArc = span >= Math.PI ? 1 : 0
    return `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

const Gauge = (props: GaugeConfig) => {
    const containerRef = useRef<HTMLDivElement>(null)
    // Explicit pixel dimensions measured from the container via ResizeObserver.
    // SVG percentage dimensions are unreliable inside CSS flex/grid containers,
    // so we pass concrete pixel values and let the viewBox handle scaling.
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const darkMode = useDarkMode()

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect
            setDimensions({ width, height })
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const min = props.min ?? 0
    const max = props.max ?? 100
    // Treat the sentinel bad-data value as missing
    const value = props.value === badData ? null : props.value

    // Map a data value to its position angle on the arc (π at min, 0 at max)
    const toAngle = (v: number) => Math.PI * (1 - (v - min) / (max - min))

    // Clamp to [0, 1] so out-of-range values don't draw outside the track
    const normalised = value !== null
        ? Math.max(0, Math.min(1, (value - min) / (max - min)))
        : null

    const inDanger = value !== null && (
        (props.dangerBelow != null && value < props.dangerBelow) ||
        (props.dangerAbove != null && value > props.dangerAbove)
    )

    const trackColor = darkMode ? '#333333' : '#e0e0e0'
    // Value arc is darker red than the danger zone so it remains visible on top
    const valueColor = inDanger ? '#770000' : '#0abbef'
    const textColor = value === null ? '#cc0000'
        : inDanger ? '#aa0000'
        : darkMode ? '#d4d4d4' : '#111111'
    const bgColor = darkMode ? '#0a0a0a' : 'white'

    const title = `${props.longName || props.parameter} (${props.units || "?"})`
    const displayValue = value !== null ? value.toFixed(1) : '---'

    return (
        // flex: 1 lets multiple gauges share space equally in a GaugePanel row/column.
        // minWidth/minHeight: 0 prevents the flex item from overflowing its container.
        <div ref={containerRef} style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
            {/* Don't render until ResizeObserver has measured the container */}
            {dimensions.width > 0 && (
                <svg
                    width={dimensions.width}
                    height={dimensions.height}
                    viewBox="0 0 200 138"
                    style={{ display: 'block', background: bgColor }}
                >
                    {/* Background track — full semicircle, always visible */}
                    <path
                        d={arcPath(Math.PI, 0)}
                        fill="none" stroke={trackColor}
                        strokeWidth={STROKE_WIDTH} strokeLinecap="round"
                    />
                    {/*
                      * Danger zones are painted above the track but below the value arc.
                      * strokeLinecap="butt" gives a flat edge at the threshold so the
                      * boundary is visually sharp; a <circle> at the outer gauge endpoint
                      * restores the rounded cap that butt removes there.
                      * Only rendered when the zone actually intersects the gauge range
                      * (dangerBelow > min, dangerAbove < max).
                      */}
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
                    {/* Value arc — narrower than the track so danger zones show through */}
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
                    {/* Range labels — positioned below the arc endpoints */}
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
            )}
        </div>
    )
}

/**
 * Renders a collection of Gauge components arranged in a row or column.
 *
 * useGauge subscribes to live parameter data and enriches the raw config
 * objects with current values; while it is loading it returns null, in which
 * case nothing is rendered.
 *
 * Each Gauge receives `flex: 1` so all gauges share the available space
 * equally regardless of how many are present.
 */
const GaugePanel = (props: GaugePanelProps) => {

    const configs = useGauge(props.configs || [])

    // useGauge returns null while the initial data fetch is in flight
    if (!configs) return <></>

    const direction = props.direction || "row"

    return (
        <div style={{
            display: "flex",
            flexDirection: direction === "row" ? "row" : "column",
            height: "100%",
            width: "100%",
        }}>
            {configs.map((config, i) => <Gauge key={i} {...config} />)}
        </div>
    )
}

// Default export used by the widget dispatcher; configs are populated at
// runtime via useGauge once the panel is wired up to a view configuration.
const GaugePanelDispatcher = () => {
    return <GaugePanel configs={[]} direction="row" />
}

export default GaugePanelDispatcher
export { Gauge, GaugePanel }
