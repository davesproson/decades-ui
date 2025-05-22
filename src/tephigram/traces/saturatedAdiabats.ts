import { UnlabelledBackgroundTrace } from '../types';
import { tphiToXy } from '.';
import { L, KELV, RV, RD, CP, SALRMin, SALRMax, dSALR } from './constants';

/*=================================================================== 
 * Return a set of traces which correspond to the lines of the
 * saturated adiabatic lapse rate.
 *
 * Returns:
 *      an array of trace objects which can be directly used with
 *      plotly.
 *===================================================================*/
export const getSatAdiabats = (darkMode: boolean) => {
    const getAdiabatGradient = (
        p: number, t1: number, dp: number, nostop: boolean
    ) => {

        const t = t1 + KELV;
        const lsbc = (L / RV) * ((1 / KELV) - (1 / t));
        const rw = 6.11 * Math.exp(lsbc) * (0.622 / p);
        const lrwbt = (L * rw) / (RD * t);
        const nume = ((RD * t) / (CP * p)) * (1.0 + lrwbt);
        const deno = 1.0 + (lrwbt * ((0.622 * L) / (CP * t)));
        const gradi = nume / deno;
        let dt = dp * gradi;

        if ((t1 + dt < -50.0) && !nostop) {
            dt = -50 - t1;
            dp = dt / gradi;
        }

        return [dp, dt];
    }

    const salrs = [],
        dp_above = -5


    for (let temp = SALRMin; temp <= SALRMax; temp += dSALR) {
        const scratch = [];
        let pr_old = 1100;
        let t_old = temp;

        scratch.push(tphiToXy(pr_old, t_old));

        const xs = [],
            ys = [];

        for (let i = 0; i <= 198; i++) {
            const scratch2 = getAdiabatGradient(pr_old, t_old, dp_above, false);
            t_old = t_old + scratch2[1];
            pr_old = pr_old + scratch2[0];
            const a = tphiToXy(pr_old, t_old);

            xs.push(a[0]);
            ys.push(a[1]);

        }

        salrs.push([xs, ys]);

    }

    const traces: Array<UnlabelledBackgroundTrace> = [];
    salrs.forEach((t) => {
        traces.push({
            x: t[0],
            y: t[1],
            showlegend: false,
            mode: 'lines',
            hoverinfo: 'none',
            line: {
                color: darkMode ? '#bbbbbb' : '#000000',
                width: .5,
            }
        });
    });

    return traces;
}
