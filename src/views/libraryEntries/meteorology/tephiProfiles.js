export const tephiProfiles = {
    title: "Vertical Profiles",
    description: `A tephigram on the left, and vertical profiles of wind speed and direction,
    bulk water (Nevzorov), and aerosol (CPC, PCASP) on the right.`,
    config: {
        "version": 3,
        "type": "view",
        "rows": 2,
        "columns": 1,
        "rowPercent": [
            100
        ],
        "columnPercent": [
            50,
            50
        ],
        "elements": [
            {
                "type": "tephi"
            },
            {
                "type": "view",
                "rows": 3,
                "columns": 1,
                "rowPercent": [
                    100
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
                            "adc_wind_angle",
                            "adc_wind_speed"
                        ],
                        "axes": [
                            "adc_wind_angle",
                            "adc_wind_speed"
                        ],
                        "timeframe": "30min",
                        "plotStyle": "line",
                        "scrolling": false,
                        "header": false,
                        "ordvar": "pressure_height_kft",
                        "swapxy": true
                    },
                    {
                        "type": "plot",
                        "params": [
                            "nevzorov_liquid_water",
                            "nevzorov_total_water"
                        ],
                        "axes": [
                            "nevzorov_liquid_water,nevzorov_total_water"
                        ],
                        "timeframe": "30min",
                        "plotStyle": "line",
                        "scrolling": false,
                        "header": false,
                        "ordvar": "pressure_height_kft",
                        "swapxy": true
                    },
                    {
                        "type": "plot",
                        "params": [
                            "cpc_counts",
                            "pcasp_number_conc"
                        ],
                        "axes": [
                            "cpc_counts",
                            "pcasp_number_conc"
                        ],
                        "timeframe": "30min",
                        "plotStyle": "line",
                        "scrolling": false,
                        "header": false,
                        "ordvar": "pressure_height_kft",
                        "swapxy": true
                    }
                ]
            }
        ],
        "title": "Vertical Profiles"
    }
}