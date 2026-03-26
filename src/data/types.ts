import { PlotURLOptions } from '@/plot/types'
import { DashboardOptions } from '@/dashboard/types'
import { TephigramOptions } from '@/tephigram/types'

type DecadesDataResponse = {
    'utc_time': Array<number>,
    [key: string]: Array<number>
}

type DummyExtras = { ordvar?: string, job?: string }
type GetDataOptions = PlotURLOptions
    | TephigramOptions
    | (DashboardOptions & DummyExtras)
// | (AlarmOptions & DummyExtras)
type GetDataPlotOptions = PlotURLOptions | TephigramOptions

type DataMode =
    | { quickLookMode: false; qcJob?: null }
    | { quickLookMode: true; qcJob: number }

const LIVE_DATA_MODE: DataMode = { quickLookMode: false }

export type { GetDataOptions, GetDataPlotOptions, DecadesDataResponse, DataMode }
export { LIVE_DATA_MODE }