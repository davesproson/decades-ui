interface PlotURLOptions {
    params: Array<string>,
    axes: Array<string>
    timeframe: string,
    swapxy: boolean,
    style: string,
    scrolling: boolean,
    header: boolean,
    server?: string | undefined,
    ordvar: string,
    job?: string | null
};

/* Urgh. Why have we used two different interfaces for the same thing?
 * Actually it's probably actually three different interfaces. 
 * Think this has to do with maintaining backwards compatibility from some
 * earlier poor decisions.
 * TODO: fix this shiz.
 */
interface _PlotInternalOptions extends PlotURLOptions {
    plotStyle?: string,
    data_header?: boolean,
}
interface PlotInternalOptions extends Omit<_PlotInternalOptions, 'style'|'header'> {}

interface DecadesDataResponse {
    'utc_time': Array<number>,
    [key: string]: Array<number>
}

export type { PlotURLOptions, DecadesDataResponse, PlotInternalOptions }