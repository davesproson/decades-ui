/**
 * The options for the tephigram plot.
 */
interface TephigramOptions {
    timeframe: string,
    params: Array<string>,
    ordvar: 'static_pressure',
    server: string | undefined,
};

/**
 * The definition of a background trace (i.e. a line on the tephigram).
 */
interface UnlabelledBackgroundTrace {
    x: Array<number>,
    y: Array<number>,
    showlegend: boolean,
    hoverinfo: string,
    mode: string,
    line: {
        color: string,
        width: number,
        dash?: string
    }
}

/**
 * The definition of a background trace (i.e. a line on the tephigram),
 * with (a) label(s).
 */
interface LabelledBackgroundTrace extends UnlabelledBackgroundTrace {
    text: string[][],
    textposition: string,
    textfont: {
        size: number,
        color: string
    }
}

// A background trace can either be labelled or unlabelled.
type BackgroundTrace = UnlabelledBackgroundTrace | LabelledBackgroundTrace

/**
 * The definition of a tephigram data trace (temperature or dewpoint)
 */
interface TephigramTrace {
    x: Array<number>,
    y: Array<number>,
    showlegend: boolean,
    mode: string,
    hoverinfo: string,
    name: string,
    line: {
        width: number,
        color: string
    }
}

/**
 * The definition of the data required to plot a tephigram.
 */
interface TephigramData {
    static_pressure: Array<number>,
    utc_time: Array<number>,
    [key: string]: Array<number>

}

export type { 
    TephigramOptions,
    LabelledBackgroundTrace,
    UnlabelledBackgroundTrace,
    BackgroundTrace,
    TephigramTrace,
    TephigramData
}