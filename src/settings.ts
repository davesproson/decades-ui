import { booleanEnv, numberEnv } from "./utils"

// The deployment mode of the application. Expectss "ground", "dev" or "prod"
export const deployment = import.meta.env.VITE_VISTA_DEPLOYMENT_MODE || "dev"

// The protocol used by the server. This is determined by the deployment mode.
export const serverProtocol = {
    'ground': "https",
    'dev': "http",
    'prod': "http"
}[deployment]

// The protocol used by the websocket. This is determined by the server protocol.
export const wsProtocol = serverProtocol === "https" ? "wss" : "ws"

// Flag to enable the use of websocket data for data fetching
export const useWebSocketData = booleanEnv("VITE_VISTA_USE_WEBSOCKET_DATA", false)

// The base URL of the application. Defaults to "/"
export const base = import.meta.env.VITE_VISTA_BASE_URL || "/"

// The value to use to indicate bad or missing data. Defaults to -999.99
export const badData = numberEnv("VITE_VISTA_BAD_DATA", -999.99)

// The base URL to use for the API.
export const apiBase = {
    "ground": "/decades",
    "dev": "/decades",
    "prod": "/decades"
}[deployment]

// The endpoints to use for the API
export const apiEndpoints = {
    'parameters': `${apiBase}/parano.json`,
    'parameter_availability': `${apiBase}/params/availability`,
    'data': `${apiBase}/livedata`,
    'data_ws': `${apiBase}/livedata_ws`,
    'tank_status': `${apiBase}/tank_status`,
    'flightsummary': `${apiBase}/flightsummary/get`,
    'chat': `${apiBase}/chat`,
    'login': `${apiBase}/login`,
    'logout': `${apiBase}/logout`,
    'quicklook_jobs': `https://www.faam.ac.uk/gluxe/api/v1/quicklook-jobs`,
    'quicklook_data': `https://www.faam.ac.uk/gluxe/api/v1/quicklook-data`,
}

// Flag to enable the tutorial overlay
export const enableTutorial = booleanEnv("VITE_VISTA_ENABLE_TUTORIAL", true)

// Map geographic coordinates to the parameter names. This allows quick
// plotting against geographic coordinates.
// geoCoords is the parameter names for the live data, while geoCoordsQuicklook
// is the parameter names for the quicklook (processed) data.
export const geoCoords = {
    'latitude': 'gin_latitude',
    'longitude': 'gin_longitude',
    'altitude': 'pressure_height_kft'
}
export const geoCoordsQuicklook = {
    'latitude': 'LAT_GIN',
    'longitude': 'LON_GIN',
    'altitude': 'ALT_GIN'
}

// The default parameters to plot when the user selects a preset.
// TODO: These should be changed for quicklook mode/data.
export const presets = {
    'True air temperatures (°C)': [
        'nondeiced_true_air_temp_c',
        'deiced_true_air_temp_c'
    ],
    'Dew points (°C)': [
        'dew_point',
        'buck_mirror_temp',
        'wvss2a_tdew'
    ],
    'Tephigram': [
        'dew_point',
        'deiced_true_air_temp_c'
    ],
    'Pressure & radar alts (ft)': [
        "pressure_height_kft",
        "radar_height_kft"
    ],
    'Neph. Total Scatter (Mm-1)': [
        "neph_total_blue",
        "neph_total_green",
        "neph_total_red"
    ],
    'Turbulence Probe (hPa)': [
        "turb_probe_pitot_static", 
        "turb_probe_attack_diff",
        "turb_probe_sideslip_diff"
    ]
}
export const presetsQuicklook = {
    'True air temperatures (°C)': [
        'TAT_DI_R',
        'TAT_ND_R'
    ],
    'Dew points (°C)': [
        'TDEW_GE',
        'TDEWCR2C'
    ],
    'Tephigram': [
        'TDEWCR2C',
        'TAT_DI_R'
    ],
    'Neph. Total Scatter (Mm-1)': [
        'TSC_REDU',  
        'TSC_GRNU',
        'TSC_BLUU'
    ],
    'Turbulence Probe (hPa)': [
        'P0_S10',
        'AOA',
        'AOSS'
    ]
}

// Default parameters to include in plot headers
export const plotHeaderDefaults = [
    'gin_latitude', 'gin_longitude', 'pressure_height_kft', 'deiced_true_air_temp_c',
    'dew_point'
]

// URI to retreive map slippy tiles from
export const mapTilesUrl = import.meta.env.VITE_VISTA_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

// Experimental features
export const enableQuicklook = booleanEnv("VITE_VISTA_ENABLE_QUICKLOOK", false)
export const enableChat = booleanEnv("VITE_VISTA_ENABLE_CHAT", false)
export const enableMap = booleanEnv("VITE_VISTA_ENABLE_MAP", false)
export const enableTabbedPlots = booleanEnv("VITE_VISTA_ENABLE_TABBED_PLOTS", false)