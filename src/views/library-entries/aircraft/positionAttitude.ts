// import { onLuxe } from "../../../utils"
import { LibraryView } from "@/views/types"

export const positionAttitude: LibraryView = {
    title: "Position and Attitude",
    description: `Aircraft and attitude indicators, with a map display
                  and plots of pitch, altitude, roll and heading.`,
    config: {
        "version": 3,
        "type": "view",
        "rows": 1,
        "columns": 2,
        "rowPercent": [
            100
        ],
        "columnPercent": [
            20,
            80
        ],
        "elements": [
            {
                "type": "view",
                "rows": 2,
                "columns": 1,
                "rowPercent": [
                    70,
                    30
                ],
                "columnPercent": [
                    100
                ],
                "elements": [
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
                                "type": "heading"
                            },
                            {
                                "type": "roll"
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
                                "type": "pitch"
                            },
                            {
                                "type": "clock"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "view",
                "rows": 1,
                "columns": 2,
                "rowPercent": [
                    100
                ],
                "columnPercent": [
                    60,
                    40
                ],
                "elements": [
                    {
                        "type": "map",
                        "url": ''
                        // "url": onLuxe()
                            // ? "http://192.168.101.105/gluxe/position"
                            // : "https://www.faam.ac.uk/gluxe/position"
                    },
                    {
                        "type": "view",
                        "rows": 3,
                        "columns": 1,
                        "rowPercent": [
                            33.333333333333336,
                            33.333333333333336,
                            33.333333333333336
                        ],
                        "columnPercent": [
                            100
                        ],
                        "elements": [
                            {
                                "type": "plot",
                                "params": [
                                    "pressure_height_feet",
                                    "gin_pitch"
                                ],
                                "axes": [
                                    "pressure_height_feet",
                                    "gin_pitch"
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
                                    "gin_heading"
                                ],
                                "axes": [
                                    "gin_heading"
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
                                    "gin_roll"
                                ],
                                "axes": [
                                    "gin_roll|-50:50"
                                ],
                                "timeframe": "30min",
                                "plotStyle": "line",
                                "scrolling": true,
                                "header": false,
                                "ordvar": "utc_time",
                                "swapxy": false,
                            }
                        ]
                    }
                ]
            }
        ],
    }
}