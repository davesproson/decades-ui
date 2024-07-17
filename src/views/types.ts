interface Version2View {
    version: 2,
    config: {
        nRows: number,
        nCols: number,
    },
    plots: Array<string>
}

interface Version1View {
    version: 1,
    config: {
        nx: number,
        ny: number,
    },
    plots: Array<{
        timeframe: string,
        params: Array<string>,
        ordvar: string,
        style: string,
        swapxy: boolean
        scrolling: boolean,
        server: string,
        data_header: boolean,
        axis: Array<string>
    }>,
}

interface AlarmConfig {
    name: string,
    description: string,
    parameters: Array<string>,
    rule: string,
    disableFlash?: boolean,
    passingText?: string,
    failingText?: string,
    interval?: number,
    failOnNoData?: boolean
}

interface AlarmViewConfig {
    type: "alarms",
    alarms: Array<AlarmConfig>
}


interface DashboardViewConfig {
    type: "dashboard",
    params: Array<string>,
    limits?: Array<{param: string, min: number} | {param: string, max: number}>
}

interface URLViewConfig {
    type: "url",
    url: string
}

interface MapViewConfig  {
    type: "map",
    url: string
}

interface ClockViewConfig {
    type: "clock"
}

interface HeadingViewConfig {
    type: "heading"
}

interface RollViewConfig {
    type: "roll"
}

interface PitchViewConfig {
    type: "pitch"
}

interface TephigramViewConfig {
    type: "tephi"
}

interface TimerViewConfig {
    type: "timers",
    initialTimers: Array<{
        type: "countdown" | "countup",
        name: string,
        initialTime: number
    }>
}

interface PlotViewConfig {
    type: "plot",
    params: Array<string>,
    axes: Array<string>,
    timeframe: string,
    plotStyle: string,
    scrolling: boolean,
    header: boolean,
    ordvar: string,
    swapxy: boolean,
    job?: string,
}

type ViewConfig = (
      AlarmViewConfig 
    | DashboardViewConfig
    | URLViewConfig
    | PlotViewConfig
    | TimerViewConfig
    | TephigramViewConfig
    | PitchViewConfig
    | RollViewConfig
    | HeadingViewConfig
    | ClockViewConfig
    | MapViewConfig
    | Version3ViewElement
)

interface Version3ViewElement {
    type: "view" 
    rows: number,
    columns: number,
    rowPercent: Array<number>,
    columnPercent: Array<number>,
    elements: Array<ViewConfig>,
    title?: string,
}

interface Version3View extends Version3ViewElement {
    version: 3
    name?: string,
    id?: string,
}

interface Version3LibraryView {
    title: string,
    description?: string,
    config: Version3View
}

interface Version2LibraryView {
    title: string,
    description?: string,
    config: Version2View
}

interface Version1LibraryView {
    title: string,
    description?: string,
    config: Version1View
}

type LibraryView = Version3LibraryView | Version2LibraryView | Version1LibraryView

type LibraryViews = Array<LibraryView>

export type { 
    LibraryViews,
    LibraryView,
    Version3ViewElement,
    Version3LibraryView,
    Version2View,
    Version2LibraryView,
    Version1View,
    Version1LibraryView,
    PlotViewConfig
}