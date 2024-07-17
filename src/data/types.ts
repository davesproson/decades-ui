import { PlotURLOptions } from '@/plot/types'
import { DashboardOptions } from '@/dashboard/types'
import { TephigramOptions } from '@/tephigram/types'

type DecadesDataResponse = {
    'utc_time': Array<number>,
    [key: string]: Array<number>
}

type DummyExtras = {ordvar?: string, job?: string}
type GetDataOptions =  PlotURLOptions 
                        | TephigramOptions
                        | (DashboardOptions & DummyExtras)
                        // | (AlarmOptions & DummyExtras)
type GetDataPlotOptions = PlotURLOptions | TephigramOptions

export type { GetDataOptions, GetDataPlotOptions, DecadesDataResponse }