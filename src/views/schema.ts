import { z } from 'zod'

const GaugeConfig = z.object({
    type: z.literal('gauge'),
    direction: z.union([z.literal('row'), z.literal('column')]),
    configs: z.array(z.object({
        parameter: z.string(),
        min: z.number(),
        max: z.number(),
        dangerBelow: z.union([z.number(), z.null()]),
        dangerAbove: z.union([z.number(), z.null()]),
        value: z.null().optional(),
    }))
})

const AlarmConfig = z.object({
    name: z.string(),
    id: z.string().optional(),
    description: z.string(),
    parameters: z.array(z.string()),
    rule: z.string(),
    disableFlash: z.boolean().optional(),
    passingText: z.string().optional(),
    failingText: z.string().optional(),
    interval: z.number().int().optional(),
    failOnNoData: z.boolean().optional(),
    muteOnFail: z.boolean().optional(),
})

const AlarmViewConfig = z.object({
    type: z.literal('alarms'),
    alarms: z.array(AlarmConfig),
})

const DashboardViewConfig = z.object({
    type: z.literal('dashboard'),
    size: z.union([z.literal('small'), z.literal('large')]).optional(),
    params: z.array(z.string()),
    limits: z.array(z.union([z.object(
        {
            param: z.string(),
            min: z.number(),
        }),
    z.object({
        param: z.string(),
        max: z.number(),
    })])).optional(),
})

const URLViewConfig = z.object({
    type: z.literal('url'),
    url: z.string(),
})

const MapViewConfig = z.object({
    type: z.literal('map'),
})

const ClockViewConfig = z.object({
    type: z.literal('clock'),
})

const HeadingViewConfig = z.object({
    type: z.literal('heading'),
})

const RollViewConfig = z.object({
    type: z.literal('roll'),
})

const PitchViewConfig = z.object({
    type: z.literal('pitch'),
})

const TephigramViewConfig = z.object({
    type: z.literal('tephi'),
})

const FlightSummaryViewConfig = z.object({
    type: z.literal('flight-summary'),
})

const ChatViewConfig = z.object({
    type: z.literal('chat'),
})

const TimerViewConfig = z.object({
    type: z.literal('timers'),
    initialTimers: z.array(z.object({
        name: z.string(),
        type: z.enum(['countdown', 'countup']),
        initialTime: z.number(),
    })),
})

const PlotViewConfig = z.object({
    type: z.literal('plot'),
    params: z.array(z.string()),
    axes: z.array(z.string()),
    timeframe: z.string(),
    plotStyle: z.string(),
    scrolling: z.boolean(),
    header: z.boolean(),
    ordvar: z.string(),
    swapxy: z.boolean(),
    job: z.number().int().optional(),
    mask: z.boolean().optional(),
})

const _BASEversion3ViewElement = z.object({
    type: z.literal('view'),
    rows: z.number().int(),
    columns: z.number().int(),
    rowPercent: z.array(z.number()),
    columnPercent: z.array(z.number()),
    title: z.string().optional(),
})

type _ViewType = z.infer<typeof _BASEversion3ViewElement> & {
    elements: Array<
        z.infer<typeof AlarmViewConfig>
        | z.infer<typeof DashboardViewConfig>
        | z.infer<typeof URLViewConfig>
        | z.infer<typeof MapViewConfig>
        | z.infer<typeof ClockViewConfig>
        | z.infer<typeof HeadingViewConfig>
        | z.infer<typeof RollViewConfig>
        | z.infer<typeof PitchViewConfig>
        | z.infer<typeof TephigramViewConfig>
        | z.infer<typeof TimerViewConfig>
        | z.infer<typeof PlotViewConfig>
        | z.infer<typeof FlightSummaryViewConfig>
        | z.infer<typeof ChatViewConfig>
        | z.infer<typeof GaugeConfig>
        | _ViewType
    >
}

const nonRecursiveElements = z.union([
    AlarmViewConfig,
    DashboardViewConfig,
    URLViewConfig,
    MapViewConfig,
    ClockViewConfig,
    HeadingViewConfig,
    RollViewConfig,
    PitchViewConfig,
    TephigramViewConfig,
    TimerViewConfig,
    PlotViewConfig,
    FlightSummaryViewConfig,
    ChatViewConfig,
    GaugeConfig,
])

export const version3ViewElement: z.ZodType<_ViewType> = _BASEversion3ViewElement.extend({
    elements: z.array(
        z.union([
            nonRecursiveElements,
            z.lazy(() => version3ViewElement),
        ])
    ),
})

export const version3View = _BASEversion3ViewElement.extend({
    version: z.literal(3),
    name: z.string().optional(),
    id: z.string().optional(),
    elements: z.array(
        z.union([
            nonRecursiveElements,
            z.lazy(() => version3ViewElement),
        ])
    ),
})