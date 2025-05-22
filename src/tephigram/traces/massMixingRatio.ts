import { pressMax, KELV, RV, L } from './constants';
import { tphiToXy } from '.';
import { LabelledBackgroundTrace } from '../types';

/*===================================================================
 * Return a set of traces which correspond to the lines of constant
 * moisture mass mixing ratios on the plot axis.
 *
 * Returns:
 *      an array of trace objects which can be directly used with
 *      plotly.
 *===================================================================*/
export const getMassMixingRatios = (darkMode: boolean) => {

    const massMixLines = [
        .005, .0625, .125, .25, .5, 1, 2, 4, 8, 16, 32
    ];


    const massMixes: (number | null)[][][] = []

    const p = [200, (300 + pressMax) / 3, pressMax + 100];

    const massMix = (p: Array<number>, mix: number) => {
        const t: number[] = [];
        for (let i = 0; i < p.length; i++) {
            let vapp = p[i] * (8 / 5) * (mix / 1000);
            t[i] = 1 / ((1 / KELV) - ((RV / L) * Math.log(vapp / 6.11))) - KELV;
        }
        return t
    }

    for (let ml = 0; ml < massMixLines.length; ml++) {

        const xs: (number | null)[] = [],
            ys: (number | null)[] = [];

        const tt = massMix(p, massMixLines[ml]);

        for (let mi = 0; mi < p.length; mi++) {
            let temp = tphiToXy(p[mi], tt[mi]);
            xs.push(temp[0]);
            ys.push(temp[1]);
        }

        massMixes.push([xs, ys])
    }

    const traces: Array<LabelledBackgroundTrace> = [];

    massMixes.forEach((t, i) => {
        traces.push({
            x: t[0],
            y: t[1],
            showlegend: false,
            mode: 'lines+text',
            hoverinfo: 'none',
            line: {
                color: darkMode ? "white" : '#000000',
                width: .5,
                dash: 'dot'
            },
            text: Array(3).fill(massMixLines[i] + ' g/kg'),
            textposition: 'center',
            textfont: {
                size: 8,
                color: darkMode ? "white" : '#000000'
            }
        });
    });

    return traces

}