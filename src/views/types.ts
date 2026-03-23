import {
    // AlarmConfig, AlarmViewConfig, ClockViewConfig, DashboardViewConfig,
    // HeadingViewConfig, MapViewConfig, PitchViewConfig, PlotViewConfig, RollViewConfig, TephigramViewConfig, TimerViewConfig, URLViewConfig, 
    version3View, version3ViewElement
} from "./schema"

import { z } from "zod"

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

// export type AlarmConfig = z.infer<typeof AlarmConfig>
// export type AlarmViewConfig = z.infer<typeof AlarmViewConfig>
// export type DashboardViewConfig = z.infer<typeof DashboardViewConfig>
// export type URLViewConfig = z.infer<typeof URLViewConfig>
// export type MapViewConfig = z.infer<typeof MapViewConfig>
// export type ClockViewConfig = z.infer<typeof ClockViewConfig>
// export type HeadingViewConfig = z.infer<typeof HeadingViewConfig>
// export type RollViewConfig = z.infer<typeof RollViewConfig>
// export type PitchViewConfig = z.infer<typeof PitchViewConfig>
// export type TephigramViewConfig = z.infer<typeof TephigramViewConfig>
// export type TimerViewConfig = z.infer<typeof TimerViewConfig>
// export type PlotViewConfig = z.infer<typeof PlotViewConfig>

type Version3ViewElement = z.infer<typeof version3ViewElement>
type Version3View = z.infer<typeof version3View>

interface LibraryViewBase<T> {
    title: string,
    description?: string,
    config: T
}

type Version3LibraryView = LibraryViewBase<Version3View>
type Version2LibraryView = LibraryViewBase<Version2View>
type Version1LibraryView = LibraryViewBase<Version1View>

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
}