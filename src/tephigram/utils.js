/*===================================================================
 * Returns the set of plotly traces that makes up the 'background'
 * of the tephigram.
 *
 * Returns:
 *  traces - an array of traces containing lines of constant temp,
 *           theta, pressure, mass mixing ratio and sat. adiabats.
 *===================================================================*/
const getTraces = (darkMode) => {
    const traces = getIsotherms(isoThermMin, isoThermMax, dIsoTherm, darkMode);
    let _traces = getThetas(thetaMin, thetaMax, dTheta, darkMode);
    traces.push.apply(traces, _traces);

    _traces = getIsobars(pressMin, pressMax, dPress, darkMode);
    traces.push.apply(traces, _traces);

    _traces = getMassMixRatios(darkMode);
    traces.push.apply(traces, _traces);

    _traces = getSatAdiabats(darkMode);
    traces.push.apply(traces, _traces);


    return traces
}

const populateTephigram = (nbg, data, ref) => {
    
    const xs = [],
          ys = []

    const range = [];

    let cnt = 0
    for(var par of Object.keys(data)) {
        if(par == 'static_pressure' || par == 'utc_time') {
            continue;
        }
        
        const x = [],
              y = [];

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

    import('plotly.js-dist').then((Plotly) => {
        Plotly.extendTraces(ref.current, {
            x: xs,
            y: ys
        }, range);
    });

}

// Required physical constants
const MA = 300,
      KELV = 273.15,
      K = 0.286,
      L = 2.5e6,
      RV = 461,
      RD = 287,
      CP = 1.01e3

// Parameters for isotherm lines
const dIsoTherm = 10,
      isoThermMin = -80.0, //in °C 
      isoThermMax = 60.0; //in °C 

// Parameters for potential temperature lines
const dTheta = 10,
      thetaMin = -20,
      thetaMax = 90;

// Parameters for pressure lines
const dPress = 50,
      pressMin = 200,
      pressMax = 1100;

// Parameters for saturated adiabats
const dSALR = 2.0,
      SALRMin = -40, //°C
      SALRMax = 60; //°C


/*===================================================================
 * Map from pressure, temperature to graphing x, y cooddinates.
 *
 * Args:
 *      press: pressure in hPa
 *      temp: temperature in degrees C
 *
 * Returns:
 *      a length-2 array containing x and y coordinates.
 *===================================================================*/
const tphiToXy = (press, temp) => {
    const t = temp + KELV;
    const theta = t * (Math.pow((1000 / press), K));
    const phi = Math.log(theta);
    const x = phi * MA + temp;
    const y = phi * MA - temp;

    return [x, y];
}

/*===================================================================
 * Map from graph x and y coordinates to temperature and 
 * pressure.
 *
 * Args:
 *      x: graph x-coordinate
 *      y: graph y-coordinate
 *
 * Returns:
 *      a length-2 array giving corresponding temperature (C) and
 *      pressure (hPa)
 *===================================================================*/
const xyToTphi = (x, y) =>  {
    const phi = (x + y) / (2 * MA)
    const t = x - (phi * MA);
    const theta = Math.exp(phi);

    const Tk = t + KELV;

    const P = 1000 / Math.exp((phi - Math.log(Tk)) / K);

    return [t, P];
}


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
const getIsotherms = (isoThermMin, isoThermMax, dIsoTherm, darkMode) => {
    const isotherms = []; 
    const isotherm_labels = [];
    const t1 = [-40.0,190.0];

    const phm = [];

    phm[0] = MA * Math.log(t1[0] + KELV);
    phm[1] = MA * Math.log(t1[1] + KELV);

    for(let T=isoThermMin; T < isoThermMax; T+=dIsoTherm) {
        // Three points on isotherms, despite being straight lines,
        // for text label placement
        isotherms.push([
            [phm[0]+T, (phm[0]+T + phm[1]+T) / 2, phm[1]+T],
            [phm[0]-T, (phm[0]-T + phm[1]-T) / 2, phm[1]-T]
        ]);
        isotherm_labels.push([T + ' C']);
    }

    const traces = [];

    let _line
    isotherms.forEach((t, i) => {
        if((isoThermMin + i*dIsoTherm) == 0) {
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
const getThetas = (thetaMin, thetaMax, dTheta, darkMode) => {
    const thetas = [];
    const theta_labels = [];
    const t1 = [-80, 50];

    for(let theta=thetaMin; theta<thetaMax; theta+=dTheta) {
        const phm1 = MA * Math.log(theta + KELV);
        thetas.push([
            [phm1+t1[0], phm1+(t1[0] + t1[1]) / 2, phm1+t1[1]],
            [phm1-t1[0], phm1-(t1[0] + t1[1]) / 2, phm1-t1[1]]
        ]);
        theta_labels.push([theta + ' C']);
    }

    const traces = []

    thetas.forEach((t, i) => {
        traces.push({
            x: t[0],
            y: t[1],
            showlegend: false,
            hovermode: false,
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
const getIsobars = (pressMin, pressMax, dPress, darkMode) => {
    const isobars = [];

    for(let press=pressMax; press>=pressMin; press-=dPress) {
        const xs = [],
              ys = [];

        for(let i=0; i<14; i++) {
            const temp = (10 * i) - 80;
            const blah = (tphiToXy(press, temp));
            xs.push(blah[0])
            ys.push(blah[1])
        }

        isobars.push([xs, ys]);
    }

    const traces = [];

    isobars.forEach((t, i) => {
        const _pres = pressMax - (i)*dPress;
        let _line
        if(_pres == 1000 || _pres == 500 || _pres == 250) {
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

        const _text = [];
        for(let _j=0; _j<t[0].length; _j++) {
            if(_j%3 == 0)
                _text.push(_pres + ' hPa');
            else
                _text.push(null);
        }

        const _trace = {
            x: t[0],
            y: t[1],
            showlegend: false,
            mode: 'lines+text',
            hoverinfo: 'none',
            line: _line,
        };

        if(_pres % 100 == 0) {
            _trace.text = _text;
            _trace.textposition = 'center';
            _trace.textfont = {
                size: 10,
                color: darkMode ? "cyan" : '0000aa'
            };
        }

        traces.push(_trace);
    });

    return traces
}

/*===================================================================
 * Return a set of traces which correspond to the lines of constant
 * moisture mass mixing ratios on the plot axis.
 *
 * Returns:
 *      an array of trace objects which can be directly used with
 *      plotly.
 *===================================================================*/
const getMassMixRatios = (darkMode) => {

    const massMixLines = [
        .005, .0625, .125, .25, .5, 1, 2, 4, 8, 16, 32
    ];


    const massMixes = []

    const p = [200, (300+pressMax) / 3, pressMax+100];

    const massMix = (p, mix) => {
        const t = [];
        for(let i=0; i<p.length; i++) {
            let vapp = p[i] * (8 / 5) * (mix / 1000);
            t[i] = 1 / ((1 / KELV) - ((RV / L) * Math.log(vapp / 6.11))) - KELV;
        }
        return t
    }

    for(let ml=0; ml<massMixLines.length; ml++) {

        const xs = [],
              ys = [];

        const tt = massMix(p, massMixLines[ml]);

        for(let mi=0; mi<p.length; mi++) {
            let temp = tphiToXy(p[mi], tt[mi]);
            xs.push(temp[0]);
            ys.push(temp[1]);
        }

        massMixes.push([xs, ys])
    }

    const traces = [];

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

/*=================================================================== 
 * Return a set of traces which correspond to the lines of the
 * saturated adiabatic lapse rate.
 *
 * Returns:
 *      an array of trace objects which can be directly used with
 *      plotly.
 *===================================================================*/
const getSatAdiabats = () => {
    const getAdiabatGradient = (p, t1, dp, nostop) => {
        const t = t1 + KELV;
        const lsbc = (L / RV) * ((1 / KELV) - (1 / t));
        const rw = 6.11 * Math.exp(lsbc) * (0.622 / p);
        const lrwbt = (L * rw) / (RD * t);
        const nume = ((RD * t) / (CP * p)) * (1.0 + lrwbt);
        const deno = 1.0 + (lrwbt * ((0.622 * L) / (CP * t)));
        const gradi = nume / deno;
        let dt = dp * gradi;

        if((t1 + dt < -50.0) & !nostop) {
            dt = -50 - t1;
            dp = dt / gradi;
        }

        return [dp, dt];
    }

    const salrs = [],
          dp_above = -5


    for(let temp=SALRMin; temp<=SALRMax; temp+=dSALR) {
        const scratch = [];
        let pr_old = 1100;
        let t_old = temp;

        scratch.push(tphiToXy(pr_old, t_old));

        const xs = [],
              ys = [];

        for(let i=0;i<=198;i++){
            const scratch2 = getAdiabatGradient(pr_old, t_old, dp_above, false);
            t_old = t_old + scratch2[1];
            pr_old = pr_old + scratch2[0];
            const a = tphiToXy(pr_old,t_old);

            xs.push(a[0]);
            ys.push(a[1]);

        }

        salrs.push([xs, ys]);

    }

    const traces = [];
    salrs.forEach((t) => {
        traces.push({                   
            x: t[0],
            y: t[1],
            showlegend: false,
            mode: 'lines',
            hoverinfo: 'none',
            line: {
                color: '#000000',
                width: .5,
            }
        });
    });

    return traces;
}


export {
    getTraces, populateTephigram
}