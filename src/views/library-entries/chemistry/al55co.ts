import { LibraryView } from "@/views/types";

export const AL55CO: LibraryView = {
    title: "AL55 CO Diagnostics",
    description: "Diagnostic plots for the AL55 CO system",
    config: {
        "title": "AL5005",
        "version": 3,
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
                    "corechem_al55co01_conc",
                    "corechem_al55co01_counts"
                ],
                "axes": [
                    "corechem_al55co01_conc|-100:1000",
                    "corechem_al55co01_counts|0:50000"
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
                    "corechem_al55co01_sens",
                    "corechem_al55co01_zero"
                ],
                "axes": [
                    "corechem_al55co01_sens|50:100",
                    "corechem_al55co01_zero|4000:8000"
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
                    "corechem_al55co01_pcell"
                ],
                "axes": [
                    "corechem_al55co01_pcell|0:10"
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
                    "corechem_al55co01_flowlamp",
                    "corechem_al55co01_flowmono"
                ],
                "axes": [
                    "corechem_al55co01_flowlamp,corechem_al55co01_flowmono|0:50"
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
                    "corechem_al55co01_templamp",
                    "corechem_al55co01_tempcell"
                ],
                "axes": [
                    "corechem_al55co01_templamp,corechem_al55co01_tempcell|10:40"
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
                    "co_reg1_cylcont",
                    "co_reg2_cylcont"
                ],
                "axes": [
                    "co_reg1_cylcont,co_reg2_cylcont|0:200"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false
            }
        ]
    }
}