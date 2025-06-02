import { LibraryView } from "@/views/types";

export const FGGA: LibraryView = {
    title: "FGGA Diagnostics",
    description: "Diagnostic plots for the FAAM fast greenhouse gas analyser (FGGA)",
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
                    "corechem_chfgga02_co2_dry",
                    "corechem_chfgga02_V1"
                ],
                "axes": [
                    "corechem_chfgga02_co2_dry",
                    "corechem_chfgga02_V1|-1:5"
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
                    "corechem_chfgga02_ch4_dry",
                    "corechem_chfgga02_V1"
                ],
                "axes": [
                    "corechem_chfgga02_ch4_dry",
                    "corechem_chfgga02_V1|-1:5"
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
                    "corechem_chfgga02_h2o",
                    "corechem_chfgga02_temp_c"
                ],
                "axes": [
                    "corechem_chfgga02_h2o",
                    "corechem_chfgga02_temp_c|10:40"
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
                    "corechem_chfgga02_press_torr",
                    "corechem_chfgga02_PPT2_press",
                    "corechem_chfgga02_APR_press_percent"
                ],
                "axes": [
                    "corechem_chfgga02_press_torr,corechem_chfgga02_PPT2_press|135:145",
                    "corechem_chfgga02_APR_press_percent|0:20"
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
                    "corechem_chfgga02_MFC1_mass_flow",
                    "corechem_chfgga02_MFC1_set_point",
                    "corechem_chfgga02_MFC4_mass_flow",
                    "corechem_chfgga02_MFC4_set_point"
                ],
                "axes": [
                    "corechem_chfgga02_MFC1_mass_flow,corechem_chfgga02_MFC1_set_point,corechem_chfgga02_MFC4_mass_flow,corechem_chfgga02_MFC4_set_point|-0.5:28"
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
                    "corechem_chfgga02_rda_usec",
                    "corechem_chfgga02_rdb_usec"
                ],
                "axes": [
                    "corechem_chfgga02_rda_usec|11:15",
                    "corechem_chfgga02_rdb_usec|13:16"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false,
            }
        ],
        "title": "FGGA",
        "version": 3
    }
}