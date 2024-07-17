import { LabelledBackgroundTrace } from "../types";
import { KELV, MA } from "./constants";

/*===================================================================
 * Return a set of traces which correspond to the lines of constant
 * temperature on the plot axis.
 *
 * Args:
 *      isoThermMin: the value of the smallest isotherm line.
 *      isoThermMax: the value of the largest isothem line.
 *      dIsoTherm: the spacing between isoTherm Llnes.
 *
 * Returns:
 *      an array of trace objects which can be directly used with
 *      plotly.
 *===================================================================*/
export const getIsotherms = (
    isoThermMin: number, isoThermMax: number, dIsoTherm: number, _darkMode: boolean
) => {
    const isotherms: number[][][] = [];
    const isotherm_labels: string[][] = [];
    const t1 = [-40.0, 190.0];

    const phm: number[] = [];

    phm[0] = MA * Math.log(t1[0] + KELV);
    phm[1] = MA * Math.log(t1[1] + KELV);

    for (let T = isoThermMin; T < isoThermMax; T += dIsoTherm) {
        // Three points on isotherms, despite being straight lines,
        // for text label placement
        isotherms.push([
            [phm[0] + T, (phm[0] + T + phm[1] + T) / 2, phm[1] + T],
            [phm[0] - T, (phm[0] - T + phm[1] - T) / 2, phm[1] - T]
        ]);
        isotherm_labels.push([T + ' C']);
    }

    const traces: Array<LabelledBackgroundTrace> = [];

    let _line
    isotherms.forEach((t, i) => {
        if ((isoThermMin + i * dIsoTherm) === 0) {
            _line = {
                color: '#aa0000',
                width: 1.5
            }
        } else {
            _line = {
                color: '#aa0000',
                width: .5
            }
        }
        traces.push({
            x: t[0],
            y: t[1],
            showlegend: false,
            hoverinfo: 'none',
            mode: 'lines+text',
            line: _line,
            text: [isotherm_labels[i], isotherm_labels[i], isotherm_labels[i]],
            textposition: 'center',
            textfont: {
                size: 10,
                color: '#aa0000'
            }
        });
    });

    return traces;
} 