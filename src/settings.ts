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

// The base URL of the application. Defaults to "/decades-vista/"
export const base = import.meta.env.VITE_VISTA_BASE_URL || "/decades-vista/"

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
    'True air temperatures (C)': [521, 524],
    'Dew points (C)': [529, 550, 931],
    'Tephigram': [529, 521],
    'Pressure & radar alts (ft)': [579, 977],
    'Neph. SP (Mm-1)': [622, 623, 624],
    'Turbulence Probe': [593, 594, 595]
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