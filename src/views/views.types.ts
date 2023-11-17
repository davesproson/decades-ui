interface Version2View {
    version: 2,
    nRows: number,
    nCols: number,
    plots: Array<string>
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

interface Version3ViewElement {
    type: "view" 
    rows: number,
    columns: number,
    rowPercent: Array<number>,
    columnPercent: Array<number>,
    elements: Array<AlarmViewConfig | DashboardViewConfig | Version3ViewElement>
}

interface Version3View extends Version3ViewElement {
    version: 3
}

interface LibraryView {
    title: string,
    description: string,
    config: Version2View | Version3View
}

type LibraryViews = Array<LibraryView>

export type { LibraryViews }
