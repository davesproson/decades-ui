import { base } from "../settings"
import { onLuxe } from "../utils"
import { LibraryViews } from "./views.types"

const libraryViews: LibraryViews = [
    {
        title: "Aircraft position and attitude",
        description: `2x2 grid which displays a map, a plot of altitudes, 
                      a plot of aircraft pitch and roll, and a dashboard`,
        config: {
            version: 2,
            nRows: 2,
            nCols: 2,
            plots: [
                onLuxe() ? "http://192.168.101.105/gluxe/position" : "https://www.faam.ac.uk/gluxe/position",
                `plot?timeframe=30min&params=pressure_height_kft,radar_height_kft&axis=pressure_height_kft&axis=radar_height_kft&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `plot?timeframe=30min&params=gin_pitch,gin_roll&axis=gin_pitch,gin_roll&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `dashboard?params=gin_altitude,gin_heading,gin_latitude,gin_longitude,gin_pitch,gin_roll,gin_speed,gin_wind_angle,gin_wind_speed`,
            ]
        }
    }, 
    {
        title: "Basic Meteorology",
        description: `2x2 grid of basic met parameters, including true air temperatures, dew point
                      temperatures and humidity, wind speed and direction, and turbulence probe 
                      differential pressures.`,
        config: {
            version: 2,
            nRows: 2,
            nCols: 2,
            plots: [
                `plot?timeframe=30min&params=deiced_true_air_temp_c,nondeiced_true_air_temp_c&axis=deiced_true_air_temp_c,nondeiced_true_air_temp_c&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `plot?timeframe=30min&params=buck_mirror_temp,dew_point,specific_humidity&axis=buck_mirror_temp,dew_point&axis=specific_humidity&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `plot?timeframe=30min&params=adc_eastwards_wind_component,adc_northwards_wind_component,adc_wind_speed&axis=adc_eastwards_wind_component,adc_northwards_wind_component&axis=adc_wind_speed&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
                `plot?timeframe=30min&params=turb_probe_attack_diff,turb_probe_pitot_static,turb_probe_sideslip_diff&axis=turb_probe_attack_diff,turb_probe_sideslip_diff&axis=turb_probe_pitot_static&swapxy=false&scrolling=true&data_header=false&style=line&ordvar=utc_time`,
            ]
        }
    },
    {
        title: "Vertical profiles",
        description: `A tephigram on the left, and vertical profiles of wind speed and direction,
                      bulk water (Nevzorov), and aerosol (CPC) on the right.`,
        config: {
            version: 2,
            nRows: 1,
            nCols: 2,
            plots: [
                `tephigram?timeframe=30min&params=deiced_true_air_temp_c,dew_point`,
                `view?nRows=1&nCols=3&plot=cGxvdD90aW1lZnJhbWU9MzBtaW4mcGFyYW1zPWFkY193aW5kX2FuZ2xlLGFkY193aW5kX3NwZWVkJmF4aXM9YWRjX3dpbmRfc3BlZWQmYXhpcz1hZGNfd2luZF9hbmdsZSZzd2FweHk9dHJ1ZSZzY3JvbGxpbmc9ZmFsc2UmZGF0YV9oZWFkZXI9ZmFsc2Umc3R5bGU9bGluZSZvcmR2YXI9cHJlc3N1cmVfaGVpZ2h0X2tmdA==&plot=cGxvdD90aW1lZnJhbWU9MzBtaW4mcGFyYW1zPW5ldnpvcm92X2xpcXVpZF93YXRlcixuZXZ6b3Jvdl90b3RhbF93YXRlciZheGlzPW5ldnpvcm92X2xpcXVpZF93YXRlcixuZXZ6b3Jvdl90b3RhbF93YXRlciZzd2FweHk9dHJ1ZSZzY3JvbGxpbmc9ZmFsc2UmZGF0YV9oZWFkZXI9ZmFsc2Umc3R5bGU9bGluZSZvcmR2YXI9cHJlc3N1cmVfaGVpZ2h0X2tmdA==&plot=cGxvdD90aW1lZnJhbWU9MzBtaW4mcGFyYW1zPWNwY19jb3VudHMmYXhpcz1jcGNfY291bnRzJnN3YXB4eT10cnVlJnNjcm9sbGluZz1mYWxzZSZkYXRhX2hlYWRlcj1mYWxzZSZzdHlsZT1saW5lJm9yZHZhcj1wcmVzc3VyZV9oZWlnaHRfa2Z0`
            ]
        }
    },
    {
        title: "Core Chemistry Diagnostics",
        description: `A set of alarms and diagnostic panels for the FAAM core chemistry operator.`,
        config: {
            "version": 3,
            "type": "view",
            "rows": 2,
            "columns": 1,
            "rowPercent": [35, 65],
            "columnPercent": [100],
            "elements": [{
                "type": "view",
                "rows": 1,
                "columns": 2,
                "rowPercent": [100],
                "columnPercent": [65, 35],
                "elements": [{
                    "type": "view",
                    "rows": 1,
                    "columns": 2,
                    "columnPercent": [70, 30],
                    "rowPercent": [100],
                    "elements": [{
                        "type": "alarms",
                        "alarms": [
                            {   
                                "name": "MFM",
                                "description": "Inlet overflow over 1.2 V",
                                "parameters": ["twbozo01_MFM", "prtaft01_wow_flag"],
                                "rule": "(prtaft01_wow_flag == 1) or (twbozo01_MFM > 1.2)",
                            },  
                            {   
                                "name": "CO Pressure",
                                "description": "CO cell pressure near 7.5 Torr",
                                "parameters": ["al55co01_pcell"],
                                "rule": "(7.2 < al55co01_pcell) and (al55co01_pcell < 7.6)"
                            },  
                            {   
                                "name": "2B O3 Conc. Glitch",
                                "description": "Checks that the TwoB ozone is in a sensible range",
                                "parameters": ["twbozo01_conc"],
                                "rule": "(0 < twbozo01_conc) and (twbozo01_conc < 500)"
                            },  
                            {   
                                "name": "FGGA Wet Cal",
                                "description": "FGGA Calibration",
                                "parameters": ["chfgga02_h2o", "chfgga02_V1", "chfgga02_MFC1_mass_flow"],
                                "rule": "(not((chfgga02_h2o <= 0) and (chfgga02_V1 == 0))) and chfgga02_MFC1_mass_flow > 4",
                                "disableFlash": true
                            },  
                            {   
                                "name": "FGGA Cell Pressure",
                                "description": "Cavity pressure at 140 Torr",
                                "parameters": ["chfgga02_press_torr", "chfgga02_V10"],
                                "rule": "(138.5 < chfgga02_press_torr) and (chfgga02_press_torr < 141.5) or (chfgga02_V10 == 0)"
                            },  
                            {   
                                "name": "FGGA FastQ",
                                "disableFlash": true,
                                "description": "FGGA FastQ",
                                "parameters": ["chfgga02_MFC4_mass_flow"],
                                "rule": "(4.5 < chfgga02_MFC4_mass_flow) and (chfgga02_MFC4_mass_flow < 5.5)"
                            },  
                            {   
                                "name": "FGGA SlowQ",
                                "description": "FGGA SlowQ",
                                "parameters": ["chfgga02_MFC4_mass_flow"],
                                "rule": "(23 < chfgga02_MFC4_mass_flow) and (chfgga02_MFC4_mass_flow < 27)",
                                "disableFlash": true
                            }   
                        ]},
                        {
                            "type": "alarms",
                            "alarms": [
                                {   
                                    "name": "V1",
                                    "description": "V1 active",
                                    "parameters": ["chfgga02_V1"],
                                    "rule": "chfgga02_V1 == 1",
                                    "disableFlash": true,
                                    "passingText": "ON",
                                    "failingText": "OFF"
                                },  
                                {   
                                    "name": "V2",
                                    "description": "V2 active",
                                    "parameters": ["chfgga02_V2"],
                                    "rule": "chfgga02_V2 == 1",
                                    "disableFlash": true,
                                    "passingText": "ON",
                                    "failingText": "OFF"
                                },  
                                {   
                                    "name": "V3",
                                    "description": "V3 active",
                                    "parameters": ["chfgga02_V3"],
                                    "rule": "chfgga02_V3 == 1",
                                    "disableFlash": true,
                                    "passingText": "ON",
                                    "failingText": "OFF"
                                },  
                                {   
                                    "name": "V4",
                                    "description": "V4 active",
                                    "parameters": ["chfgga02_V4"],
                                    "rule": "chfgga02_V4 == 1",
                                    "disableFlash": true,
                                    "passingText": "ON",
                                    "failingText": "OFF"
                                },  
                                {   
                                    "name": "V6",
                                    "description": "V6 active",
                                    "parameters": ["twbozo01_V6"],
                                    "rule": "twbozo01_V6 == 1",
                                    "disableFlash": true,
                                    "passingText": "ON",
                                    "failingText": "OFF"
                                },  
                                {   
                                    "name": "V7",
                                    "description": "V7 active",
                                    "parameters": ["chtsoo02_V7"],
                                    "rule": "chtsoo02_V7 == 1",
                                    "disableFlash": true,
                                    "passingText": "ON",
                                    "failingText": "OFF"
                                },  
                                {   
                                    "name": "V10",
                                    "description": "V10 active",
                                    "parameters": ["chfgga02_V10"],
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
                                "parameters": ["chfgga02_co2"],
                                "rule": "chfgga02_co2 != 0",
                                "interval": 15, 
                                "failOnNoData": true
                            },  
                            {   
                                "name": "2B O3 UDP",
                                "description": "TwoB Ozone data are available",
                                "parameters": ["twbozo01_temp"],
                                "rule": "twbozo01_temp != 0",
                                "interval": 15, 
                                "failOnNoData": true
                            },  
                            {   
                                "name": "AL5005 UDP",
                                "description": "AL55 UDP data are available",
                                "parameters": ["al55co01_counts"],
                                "rule": "al55co01_counts != 0",
                                "interval": 15, 
                                "failOnNoData": true
                            },  
                            {   
                                "name": "TEi SO2 UDP",
                                "description": "TECO SO2 data are available",
                                "parameters": ["chtsoo02_pmt_volt"],
                                "rule": "chtsoo02_pmt_volt != 0",
                                "interval": 15, 
                                "failOnNoData": true
                            },  
                            {   
                                "name": "TEi O3 UDP",
                                "description": "TECO Ozone data are available",
                                "parameters": ["teiozo02_press"],
                                "rule": "teiozo02_press != 0",
                                "interval": 15, 
                                "failOnNoData": true
                            }   
                        ]
                    }
                ]
            }, 
            {
                "type": "dashboard",
                "params": [
                    "chfgga02_rda_usec", "chfgga02_press_torr", "chfgga02_MFC4_mass_flow",
                    "chtsoo02_MFC3_mass_flow", "chfgga02_rdb_usec", "corechem_apr_pressure",
                    "chfgga02_MFC1_mass_flow", "corechem_mfm", "twbozo01_flow", "chfgga02_h2o",
                    "teiozo02_FlowA", "teiozo02_FlowB", "al55co01_pcell", "al55co01_counts",
                    "al55co01_flowlamp", "al55co01_flowmono"
                ],
                "limits": [
                    {"param": "chfgga02_rda_usec", "max": 10},
                    {"param": "chfgga02_press_torr", "max": 141.5},
                    {"param": "chfgga02_MFC4_mass_flow", "min": 4.5},
                    {"param": "chtsoo02_MFC3_mass_flow", "min": 1.9},
                    {"param": "chfgga02_rdb_usec", "max": 10},
                    {"param": "corechem_apr_pressure", "max": 250},
                    {"param": "corechem_mfm", "min": 1},
                    {"param": "twbozo01_flow", "min": 1800},
                    {"param": "teiozo02_FlowA", "min": 0.6},
                    {"param": "teiozo02_FlowB", "min": 0.6},
                    {"param": "al55co01_pcell", "max": 8},
                    {"param": "al55co01_flowlamp", "min": 33},
                    {"param": "al55co01_flowmono", "min": 33}
                ]
            }]
        }
    }
]

export { libraryViews }