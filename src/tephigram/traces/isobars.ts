import { tphiToXy } from ".";
import { BackgroundTrace, LabelledBackgroundTrace } from "../types";

/*===================================================================
 * Return a set of traces which correspond to the lines of constant
 * barometric pressure on the plot axis.
 *
 * Args:
 *      pressMin: the value of the smallest pressure line (hPa)
 *      pressMax: the value of the largest pressure line (hPa)
 *      dPress: the spacing between pressure lines (hPa)
 *
 * Returns:
 *      an array of trace objects which can be directly used with
 *      plotly.
 *===================================================================*/
export const getIsobars = (
    pressMin: number, pressMax: number, dPress: number, darkMode: boolean
) => {

    const isobars: (number | null)[][][] = [];

    for (let press = pressMax; press >= pressMin; press -= dPress) {
        const xs: (number | null)[] = [],
            ys: (number | null)[] = [];

        for (let i = 0; i < 14; i++) {
            const temp = (10 * i) - 80;
            const blah = (tphiToXy(press, temp));
            xs.push(blah[0])
            ys.push(blah[1])
        }

        isobars.push([xs, ys]);
    }

    const traces: Array<BackgroundTrace> = [];

    isobars.forEach((t, i) => {
        const _pres = pressMax - (i) * dPress;
        let _line: { color: string, width: number, dash: string };
        if (_pres === 1000 || _pres === 500 || _pres === 250) {
            _line = {
                color: darkMode ? "cyan" : '#0000aa',
                width: 1.5,
                dash: 'dash'
            }
        } else {
            _line = {
                color: darkMode ? "cyan" : '#0000aa',
                width: .5,
                dash: 'dash'
            }
        }

        const _text: string[][] = [];
        for (let _j = 0; _j < t[0].length; _j++) {
            if (_j % 3 === 0)
                _text.push([_pres + ' hPa']);
            else
                _text.push([""]);
        }

        let _trace: BackgroundTrace = {
            x: t[0],
            y: t[1],
            showlegend: false,
            mode: 'lines+text',
            hoverinfo: 'none',
            line: _line,
        }

        if (_pres % 100 === 0) {
            _trace = {
                ..._trace,
                text: _text,
                textposition: 'center',
                textfont: {
                    size: 10,
                    color: darkMode ? "cyan" : '0000aa'
                }
            } satisfies LabelledBackgroundTrace
        }

        traces.push(_trace);
    });

    return traces
}