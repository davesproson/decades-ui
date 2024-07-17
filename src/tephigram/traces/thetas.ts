import { LabelledBackgroundTrace } from "../types";
import { KELV, MA } from "./constants";

/*=================================================================== 
 * Return a set of traces which correspond to the lines of constant
 * potential temperature on the plot axis.
 *
 * Args:
 *      thetaMin: the value of the smallest theta line
 *      thetaMax: the value of the largest theta line
 *      dTheta: the spacing between theta lines
 *
 * Returns:
 *      an array of trace objects which can be directly used with
 *      plotly.
 *===================================================================*/
export const getThetas = (
    thetaMin: number, thetaMax: number, dTheta: number, _darkMode: boolean
) => {
const thetas: number[][][] = [];
const theta_labels: string[][] = [];
const t1 = [-80, 50];

for(let theta=thetaMin; theta<thetaMax; theta+=dTheta) {
    const phm1 = MA * Math.log(theta + KELV);
    thetas.push([
        [phm1+t1[0], phm1+(t1[0] + t1[1]) / 2, phm1+t1[1]],
        [phm1-t1[0], phm1-(t1[0] + t1[1]) / 2, phm1-t1[1]]
    ]);
    theta_labels.push([theta + ' C']);
}

const traces: Array<LabelledBackgroundTrace> = []

thetas.forEach((t, i) => {
    traces.push({
        x: t[0],
        y: t[1],
        showlegend: false,
        // hovermode: false,
        hoverinfo: 'none',
        mode: 'lines+text',
        line: {
            color: '#00aa00',
            width: .5
        },
        text: Array(3).fill(theta_labels[i]),
        textposition: 'center',
        textfont: {
            size: 10,
            color: '#00aa00'
        }
    });
});

return traces
}