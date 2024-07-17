import { tphiToXy } from './traces';
import { TephigramData } from './types';


const populateTephigram = (
        nbg: number, data: TephigramData, ref: React.RefObject<HTMLDivElement>
    ) => {
    
    const xs: (number|null)[][] = [],
          ys: (number|null)[][] = []

    const range: Array<number> = [];

    let cnt = 0
    for(var par of Object.keys(data)) {
        if(par === 'static_pressure' || par === 'utc_time') {
            continue;
        }
        
        const x: Array<number|null> = [],
              y: Array<number|null> = [];

        for(let i=0; i<data.static_pressure.length; i++) {
            let xy = tphiToXy(data.static_pressure[i], data[par][i]); 
            x.push(xy[0]);
            y.push(xy[1]);
        }

        xs.push(x);
        ys.push(y);
        range.push(nbg+cnt);
        cnt++;
    }

    import('plotly.js-dist-min').then((Plotly) => {
        if(!ref.current) {
            console.warn("Ref not set, can't plot");
            return
        }
        Plotly.extendTraces(ref.current, {
            x: xs,
            y: ys
        }, range);
    });

}

export {
    populateTephigram
}