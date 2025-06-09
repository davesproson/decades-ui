import { LibraryView } from "@/views/types";

export const TecoSO2: LibraryView = {
    title: "TEi43iSO2 Diagnostics",
    description: "Diagnostic plots for the TECO SO2 system",
    config: {
        "type": "view",
        "rows": 2,
        "columns": 3,
        "rowPercent": [
            50,
            50
        ],
        "columnPercent": [
            33.333333333333336,
            33.333333333333336,
            33.333333333333336
        ],
        "elements": [
            {
                "type": "plot",
                "params": [
                    "corechem_chtsoo02_concentration",
                    "corechem_chtsoo02_V6",
                    "corechem_chtsoo02_V7"
                ],
                "axes": [
                    "corechem_chtsoo02_concentration",
                    "corechem_chtsoo02_V6,corechem_chtsoo02_V7|-1:5"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false,
            },
            {
                "type": "plot",
                "params": [
                    "corechem_chtsoo02_MFC3_mass_flow",
                    "corechem_chtsoo02_MFC3_set_point"
                ],
                "axes": [
                    "corechem_chtsoo02_MFC3_mass_flow,corechem_chtsoo02_MFC3_set_point"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false,
            },
            {
                "type": "plot",
                "params": [
                    "corechem_chtsoo02_react_press",
                    "corechem_chtsoo02_MFC3_absolute_pressure"
                ],
                "axes": [
                    "corechem_chtsoo02_react_press",
                    "corechem_chtsoo02_MFC3_absolute_pressure"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false,
            },
            {
                "type": "plot",
                "params": [
                    "corechem_chtsoo02_internal_temper",
                    "corechem_chtsoo02_react_temper"
                ],
                "axes": [
                    "corechem_chtsoo02_internal_temper,corechem_chtsoo02_react_temper"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false,
            },
            {
                "type": "plot",
                "params": [
                    "corechem_chtsoo02_lamp_volt",
                    "corechem_chtsoo02_lamp_intens"
                ],
                "axes": [
                    "corechem_chtsoo02_lamp_volt",
                    "corechem_chtsoo02_lamp_intens"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false,
            },
            {
                "type": "plot",
                "params": [
                    "corechem_chtsoo02_pmt_volt"
                ],
                "axes": [
                    "corechem_chtsoo02_pmt_volt"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false,
            }
        ],
        "title": "TEi43iSO2",
        "version": 3
    }
}