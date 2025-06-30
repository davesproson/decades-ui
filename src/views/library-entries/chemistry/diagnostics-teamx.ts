import { LibraryView } from "@/views/types";

export const teamXCoreChemDiagnostics: LibraryView = {
    title: "TeamX Core Chemistry Diagnostics",
    description: "Diagnostics for TeamX core chemistry instruments.",
    config: {
        "type": "view",
        "rows": 1,
        "columns": 2,
        "rowPercent": [
            100
        ],
        "columnPercent": [
            50,
            50
        ],
        "elements": [
            {
                "type": "alarms",
                "alarms": [
                    {
                        "name": "AL5005 UDP",
                        "description": "AL55 UDP data are available",
                        "parameters": [
                            "al55co01_counts"
                        ],
                        "rule": "al55co01_counts!=0",
                        "passingText": "Pass",
                        "failingText": "Fail",
                        "failOnNoData": true,
                        "disableFlash": false
                    },
                    {
                        "name": "TECO O3 UDP",
                        "description": "Teiozo UDP data are available",
                        "parameters": [
                            "teiozo02_press"
                        ],
                        "rule": "teiozo02_press != 0",
                        "passingText": "Pass",
                        "failingText": "Fail",
                        "failOnNoData": true,
                        "disableFlash": false
                    },
                    {
                        "name": "AL55 data logging glitch",
                        "description": "No RS232 stream parameter register shift",
                        "parameters": [
                            "al55co01_dummy"
                        ],
                        "rule": "al55co01_dummy == 428.4",
                        "passingText": "Pass",
                        "failingText": "Fail",
                        "failOnNoData": true,
                        "disableFlash": false
                    },
                    {
                        "name": "SAMPUMP MFM",
                        "description": "Inlet overflow > 1.2 V",
                        "parameters": [
                            "teiozo02_MFM",
                            "prtaft01_wow_flag"
                        ],
                        "rule": "(prtaft01_wow_flag == 1) or (teiozo02_MFM > 1.2)",
                        "passingText": "Pass",
                        "failingText": "Fail",
                        "failOnNoData": true,
                        "disableFlash": false
                    },
                    {
                        "name": "Ozone zeroing valve",
                        "description": "V6 active (ground use only)",
                        "parameters": [
                            "teiozo02_V6"
                        ],
                        "rule": "teiozo02_V6 == 1",
                        "passingText": "ON",
                        "failingText": "OFF",
                        "disableFlash": true,
                        "muteOnFail": true
                    }
                ]
            },
            {
                "type": "view",
                "rows": 2,
                "columns": 1,
                "rowPercent": [
                    50,
                    50
                ],
                "columnPercent": [
                    100
                ],
                "elements": [
                    {
                        "type": "dashboard",
                        "size": "large",
                        "params": [
                            "corechem_mfm",
                            "teiozo02_conc",
                            "teiozo02_FlowA",
                            "teiozo02_FlowB",
                            "al55co01_conc",
                            "al55co01_pcell",
                            "al55co01_flowlamp",
                            "al55co01_flowmono"
                        ],
                        "limits": [
                            {
                                "param": "corechem_mfm",
                                "min": 5
                            },
                            {
                                "param": "teiozo02_conc",
                                "min": -3
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
                                "param": "al55co01_conc",
                                "max": 15000
                            },
                            {
                                "param": "al55co01_pcell",
                                "min": 6,
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
                        "type": "gauge",
                        "direction": "row",
                        "configs": [
                            {
                                "parameter": "co_reg1_cylcont",
                                "min": 0,
                                "max": 150,
                                "dangerBelow": 7,
                                "dangerAbove": null,
                                "value": null
                            },
                            {
                                "parameter": "co_reg2_cylcont",
                                "min": 0,
                                "max": 200,
                                "dangerBelow": 7,
                                "dangerAbove": null,
                                "value": null
                            }
                        ]
                    }
                ]
            }
        ],

        "version": 3,
        "name": "TeamX Core Chemistry Diagnostics"
    }
}
