export const corechemDiagnostics = {
    title: "Core Chemistry Diagnostics",
    description: `A set of alarms and diagnostic panels for the FAAM core chemistry operator.`,
    config: {
        "version": 3,
        "type": "view",
        "rows": 2,
        "columns": 1,
        "rowPercent": [
            35,
            65
        ],
        "columnPercent": [
            100
        ],
        "elements": [
            {
                "type": "view",
                "rows": 1,
                "columns": 2,
                "rowPercent": [
                    100
                ],
                "columnPercent": [
                    65,
                    35
                ],
                "elements": [
                    {
                        "type": "view",
                        "rows": 1,
                        "columns": 2,
                        "rowPercent": [
                            100
                        ],
                        "columnPercent": [
                            70,
                            30
                        ],
                        "elements": [
                            {
                                "type": "alarms",
                                "alarms": [
                                    {
                                        "name": "MFM",
                                        "description": "Inlet overflow over 1.2 V",
                                        "parameters": [
                                            "twbozo01_MFM",
                                            "prtaft01_wow_flag"
                                        ],
                                        "rule": "(prtaft01_wow_flag == 1) or (twbozo01_MFM > 1.2)"
                                    },
                                    {
                                        "name": "CO Pressure",
                                        "description": "CO cell pressure near 7.5 Torr",
                                        "parameters": [
                                            "al55co01_pcell"
                                        ],
                                        "rule": "(7.2 < al55co01_pcell) and (al55co01_pcell < 7.6)"
                                    },
                                    {
                                        "name": "2B O3 Conc. Glitch",
                                        "description": "Checks that the TwoB ozone is in a sensible range",
                                        "parameters": [
                                            "twbozo01_conc"
                                        ],
                                        "rule": "(0 < twbozo01_conc) and (twbozo01_conc < 500)"
                                    },
                                    {
                                        "name": "FGGA Wet Cal",
                                        "description": "FGGA Calibration",
                                        "parameters": [
                                            "chfgga02_h2o",
                                            "chfgga02_V1",
                                            "chfgga02_MFC1_mass_flow"
                                        ],
                                        "rule": "(not((chfgga02_h2o <= 0) and (chfgga02_V1 == 0))) and chfgga02_MFC1_mass_flow > 4",
                                        "disableFlash": true
                                    },
                                    {
                                        "name": "FGGA Cell Pressure",
                                        "description": "Cavity pressure at 140 Torr",
                                        "parameters": [
                                            "chfgga02_press_torr",
                                            "chfgga02_V10"
                                        ],
                                        "rule": "(138.5 < chfgga02_press_torr) and (chfgga02_press_torr < 141.5) or (chfgga02_V10 == 0)"
                                    },
                                    {
                                        "name": "FGGA FastQ",
                                        "disableFlash": true,
                                        "description": "FGGA FastQ",
                                        "parameters": [
                                            "chfgga02_MFC4_mass_flow"
                                        ],
                                        "rule": "(4.5 < chfgga02_MFC4_mass_flow) and (chfgga02_MFC4_mass_flow < 5.5)"
                                    },
                                    {
                                        "name": "FGGA SlowQ",
                                        "description": "FGGA SlowQ",
                                        "parameters": [
                                            "chfgga02_MFC4_mass_flow"
                                        ],
                                        "rule": "(23 < chfgga02_MFC4_mass_flow) and (chfgga02_MFC4_mass_flow < 27)",
                                        "disableFlash": true
                                    }
                                ]
                            },
                            {
                                "type": "alarms",
                                "alarms": [
                                    {
                                        "name": "V1",
                                        "description": "V1 active",
                                        "parameters": [
                                            "chfgga02_V1"
                                        ],
                                        "rule": "chfgga02_V1 == 1",
                                        "disableFlash": true,
                                        "passingText": "ON",
                                        "failingText": "OFF"
                                    },
                                    {
                                        "name": "V2",
                                        "description": "V2 active",
                                        "parameters": [
                                            "chfgga02_V2"
                                        ],
                                        "rule": "chfgga02_V2 == 1",
                                        "disableFlash": true,
                                        "passingText": "ON",
                                        "failingText": "OFF"
                                    },
                                    {
                                        "name": "V3",
                                        "description": "V3 active",
                                        "parameters": [
                                            "chfgga02_V3"
                                        ],
                                        "rule": "chfgga02_V3 == 1",
                                        "disableFlash": true,
                                        "passingText": "ON",
                                        "failingText": "OFF"
                                    },
                                    {
                                        "name": "V4",
                                        "description": "V4 active",
                                        "parameters": [
                                            "chfgga02_V4"
                                        ],
                                        "rule": "chfgga02_V4 == 1",
                                        "disableFlash": true,
                                        "passingText": "ON",
                                        "failingText": "OFF"
                                    },
                                    {
                                        "name": "V6",
                                        "description": "V6 active",
                                        "parameters": [
                                            "twbozo01_V6"
                                        ],
                                        "rule": "twbozo01_V6 == 1",
                                        "disableFlash": true,
                                        "passingText": "ON",
                                        "failingText": "OFF"
                                    },
                                    {
                                        "name": "V7",
                                        "description": "V7 active",
                                        "parameters": [
                                            "chtsoo02_V7"
                                        ],
                                        "rule": "chtsoo02_V7 == 1",
                                        "disableFlash": true,
                                        "passingText": "ON",
                                        "failingText": "OFF"
                                    },
                                    {
                                        "name": "V10",
                                        "description": "V10 active",
                                        "parameters": [
                                            "chfgga02_V10"
                                        ],
                                        "rule": "chfgga02_V10 == 1",
                                        "disableFlash": true,
                                        "passingText": "ON",
                                        "failingText": "OFF"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "alarms",
                        "alarms": [
                            {
                                "name": "FGGA UDP",
                                "description": "FGGA UDP data are available",
                                "parameters": [
                                    "chfgga02_co2"
                                ],
                                "rule": "chfgga02_co2 != 0",
                                "interval": 15,
                                "failOnNoData": true
                            },
                            {
                                "name": "2B O3 UDP",
                                "description": "TwoB Ozone data are available",
                                "parameters": [
                                    "twbozo01_temp"
                                ],
                                "rule": "twbozo01_temp != 0",
                                "interval": 15,
                                "failOnNoData": true
                            },
                            {
                                "name": "AL5005 UDP",
                                "description": "AL55 UDP data are available",
                                "parameters": [
                                    "al55co01_counts"
                                ],
                                "rule": "al55co01_counts != 0",
                                "interval": 15,
                                "failOnNoData": true
                            },
                            {
                                "name": "TEi SO2 UDP",
                                "description": "TECO SO2 data are available",
                                "parameters": [
                                    "chtsoo02_pmt_volt"
                                ],
                                "rule": "chtsoo02_pmt_volt != 0",
                                "interval": 15,
                                "failOnNoData": true
                            },
                            {
                                "name": "TEi O3 UDP",
                                "description": "TECO Ozone data are available",
                                "parameters": [
                                    "teiozo02_press"
                                ],
                                "rule": "teiozo02_press != 0",
                                "interval": 15,
                                "failOnNoData": true
                            }
                        ]
                    }
                ]
            },
            {
                "type": "view",
                "rows": 2,
                "columns": 1,
                "rowPercent": [
                    100
                ],
                "columnPercent": [
                    80,
                    20
                ],
                "elements": [
                    {
                        "type": "dashboard",
                        "params": [
                            "chfgga02_rda_usec",
                            "chfgga02_press_torr",
                            "chfgga02_MFC4_mass_flow",
                            "chtsoo02_MFC3_mass_flow",
                            "chfgga02_rdb_usec",
                            "corechem_apr_pressure",
                            "chfgga02_MFC1_mass_flow",
                            "corechem_mfm",
                            "twbozo01_flow",
                            "chfgga02_h2o",
                            "teiozo02_FlowA",
                            "teiozo02_FlowB",
                            "al55co01_pcell",
                            "al55co01_counts",
                            "al55co01_flowlamp",
                            "al55co01_flowmono"
                        ],
                        "limits": [
                            {
                                "param": "chfgga02_rda_usec",
                                "max": 10
                            },
                            {
                                "param": "chfgga02_press_torr",
                                "max": 141.5
                            },
                            {
                                "param": "chfgga02_MFC4_mass_flow",
                                "min": 4.5
                            },
                            {
                                "param": "chtsoo02_MFC3_mass_flow",
                                "min": 1.9
                            },
                            {
                                "param": "chfgga02_rdb_usec",
                                "max": 10
                            },
                            {
                                "param": "corechem_apr_pressure",
                                "max": 250
                            },
                            {
                                "param": "corechem_mfm",
                                "min": 1
                            },
                            {
                                "param": "twbozo01_flow",
                                "min": 1800
                            },
                            {
                                "param": "teiozo02_FlowA",
                                "min": 0.6
                            },
                            {
                                "param": "teiozo02_FlowB",
                                "min": 0.6
                            },
                            {
                                "param": "al55co01_pcell",
                                "max": 8
                            },
                            {
                                "param": "al55co01_flowlamp",
                                "min": 33
                            },
                            {
                                "param": "al55co01_flowmono",
                                "min": 33
                            }
                        ]
                    },
                    {
                        "type": "timers",
                        "initialTimers": [
                            {
                                "type": "countdown",
                                "name": "FGGA  Span",
                                "initialTime": 2700
                            },
                            {
                                "type": "countdown",
                                "name": "FGGA  Target",
                                "initialTime": 900
                            },
                            {
                                "type": "countdown",
                                "name": "SO2 Zero",
                                "initialTime": 600
                            }
                        ]
                    }
                ]
            }
        ],
        "title": "Core Chem Diagnostics"
    }
}