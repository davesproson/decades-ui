import { LibraryView } from "@/views/types";

export const TwoBO3: LibraryView = {
    title: "TwoB O3 Diagnostics",
    description: "Diagnostic plots for the TwoB Ozone system",
    config: {
        "title": "TwoBozone",
        "version": 3,
        "type": "view",
        "rows": 2,
        "columns": 2,
        "rowPercent": [
            50,
            50
        ],
        "columnPercent": [
            50,
            50
        ],
        "elements": [
            {
                "type": "plot",
                "params": [
                    "corechem_twbozo01_conc",
                    "corechem_twbozo01_V6"
                ],
                "axes": [
                    "corechem_twbozo01_conc|-50:50",
                    "corechem_twbozo01_V6|-1:5"
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
                    "corechem_twbozo01_MFM",
                    "corechem_twbozo01_flow"
                ],
                "axes": [
                    "corechem_twbozo01_flow|1500:2100",
                    "corechem_twbozo01_MFM|0:6.5"
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
                    "corechem_twbozo01_temp",
                    "corechem_twbozo01_press"
                ],
                "axes": [
                    "corechem_twbozo01_temp",
                    "corechem_twbozo01_press"
                ],
                "timeframe": "30min",
                "plotStyle": "line",
                "scrolling": true,
                "header": false,
                "ordvar": "utc_time",
                "swapxy": false,
            },
            {
                "type": "view",
                "rows": 2,
                "columns": 2,
                "rowPercent": [
                    50,
                    50
                ],
                "columnPercent": [
                    50,
                    50
                ],
                "elements": [
                    {
                        "type": "dashboard",
                        "params": [
                            "corechem_twbozo01_conc",
                        ],
                        "limits": []
                    },
                    {
                        type: "dashboard",
                        params: [
                            "corechem_twbozo01_temp",
                        ],
                        limits: []
                    },
                    {
                        type: "dashboard",
                        params: [
                            "corechem_twbozo01_press",
                        ],
                        limits: []
                    },
                    {
                        type: "dashboard",
                        params: [
                            "corechem_twbozo01_flow",
                        ],
                        limits: []
                    }
                ]
            }
        ]
    }
}