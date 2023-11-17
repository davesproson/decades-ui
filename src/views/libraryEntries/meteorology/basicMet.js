export const basicMet = {
    title: "Basic Meteorology",
    description: `2x2 grid of basic met parameters, including true air temperatures, 
                  dew point temperatures, wind speed and direction, and turbulence probe 
                  differential pressures.`,
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
        "type": "plot",
        "params": [
          "deiced_true_air_temp_c",
          "nondeiced_true_air_temp_c",
          "pressure_height_feet"
        ],
        "axes": [
          "deiced_true_air_temp_c,nondeiced_true_air_temp_c",
          "pressure_height_feet"
        ],
        "timeframe": "30min",
        "plotStyle": "line",
        "scrolling": true,
        "header": false,
        "ordvar": "utc_time",
        "swapxy": false
      },
      {
        "type": "plot",
        "params": [
          "dew_point",
          "buck_mirror_temp"
        ],
        "axes": [
          "dew_point,buck_mirror_temp"
        ],
        "timeframe": "30min",
        "plotStyle": "line",
        "scrolling": true,
        "header": false,
        "ordvar": "utc_time",
        "swapxy": false
      },
      {
        "type": "plot",
        "params": [
          "adc_northwards_wind_component",
          "adc_eastwards_wind_component",
          "adc_wind_speed"
        ],
        "axes": [
          "adc_northwards_wind_component,adc_eastwards_wind_component",
          "adc_wind_speed"
        ],
        "timeframe": "30min",
        "plotStyle": "line",
        "scrolling": true,
        "header": false,
        "ordvar": "utc_time",
        "swapxy": false
      },
      {
        "type": "plot",
        "params": [
          "turb_probe_pitot_static",
          "turb_probe_attack_diff",
          "turb_probe_sideslip_diff"
        ],
        "axes": [
          "turb_probe_attack_diff,turb_probe_sideslip_diff",
          "turb_probe_pitot_static"
        ],
        "timeframe": "30min",
        "plotStyle": "line",
        "scrolling": true,
        "header": false,
        "ordvar": "utc_time",
        "swapxy": false
      }
    ],
    "title": "Basic Met."
  }
}