import { LibraryView } from "@/views/types";

export const TecoO3: LibraryView = {
    title: "TECO O3 Diagnostics",
    description: "Diagnostic plots for the TECO Ozone system",
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
                    "corechem_teiozo02_conc",
                    "corechem_teiozo02_V6"
                ],
                "axes": [
                    "corechem_teiozo02_conc|-50:50",
                    "corechem_teiozo02_V6|-1:5"
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
                    "corechem_teiozo02_MFM",
                    "corechem_teiozo02_FlowA",
                    "corechem_teiozo02_FlowB"
                ],
                "axes": [
                    "corechem_teiozo02_FlowA,corechem_teiozo02_FlowB|0.6:0.8",
                    "corechem_teiozo02_MFM|0:6.5"
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
                    "corechem_teiozo02_press"
                ],
                "axes": [
                    "corechem_teiozo02_press"
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
                    "corechem_teiozo02_cRIO_temp_c",
                    "corechem_teiozo02_benchtemp"
                ],
                "axes": [
                    "corechem_teiozo02_cRIO_temp_c,corechem_teiozo02_benchtemp|10:40"
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
                    "corechem_teiozo02_cellAint",
                    "corechem_teiozo02_cellBint"
                ],
                "axes": [
                    "corechem_teiozo02_cellAint,corechem_teiozo02_cellBint"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false,
            },
            {
                "type": "dashboard",
                "params": [
                    "corechem_teiozo02_conc",
                    "corechem_teiozo02_press",
                    "corechem_teiozo02_cellAint",
                    "corechem_teiozo02_cellBint",
                    "corechem_teiozo02_FlowA",
                    "corechem_teiozo02_FlowB"
                ],
                "limits": [

                ]
            }
        ],
        "title": "TEi49iozone",
        "version": 3
    }
}