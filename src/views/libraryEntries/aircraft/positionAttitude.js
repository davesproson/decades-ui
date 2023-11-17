import { onLuxe } from "../../../utils"

export const positionAttitude = {
    title: "Aircraft position and attitude",
    description: `2x2 grid which displays a map, a plot of altitudes, 
                      a plot of aircraft pitch and roll, and a dashboard`,
    config: {
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
                "type": "url",
                "url": onLuxe() ? "http://192.168.101.105/gluxe/position" : "https://www.faam.ac.uk/gluxe/position",
            },
            {
                "type": "plot",
                "params": [
                    "pressure_height_feet",
                    "radar_height"
                ],
                "axes": [
                    "pressure_height_feet",
                    "radar_height"
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
                    "gin_roll",
                    "gin_pitch"
                ],
                "axes": [
                    "gin_roll,gin_pitch"
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
                    "gin_latitude",
                    "gin_longitude",
                    "gin_altitude",
                    "gin_roll",
                    "gin_pitch",
                    "gin_heading",
                    "adc_wind_angle",
                    "adc_wind_speed"
                ],
                "limits": []
            }
        ],
        "title": "Position and Attitude"
    }
}

