const booleanEnv = (key: string, defaultValue: boolean) => {
    if (import.meta.env[key] === undefined) {
        return defaultValue
    }
    return import.meta.env[key] === "true"
}

const numberEnv = (key: string, defaultValue: number) => {
    if (import.meta.env[key] === undefined) {
        return defaultValue
    }

    try {
        return parseFloat(import.meta.env[key])
    } catch {
        return defaultValue
    }
}

export const deployment = import.meta.env.VITE_DEPLOYMENT_MODE || "dev"

export const serverPrefix = ""
export const serverProtocol = {
    'demo': "https",
    'dev': "http",
    'prod': "http"
}[deployment]

export const wsProtocol = serverProtocol === "https" ? "wss" : "ws"
export const useWebSocketData = booleanEnv("VITE_USE_WEBSOCKET_DATA", false)

export const base = import.meta.env.VITE_BASE_URL || "/decades-vista/"

export const badData = numberEnv("VITE_BAD_DATA", -999.99)

export const apiBase = {
    "demo": "/live",
    "dev": "/decades",
    "prod": "/decades"
}[deployment]

export const apiEndpoints = {
    'parameters': `${apiBase}/parano.json`,
    'parameter_availability': `${apiBase}/params/availability`,
    'data': `${apiBase}/livedata`,
    'data_ws': `${apiBase}/livedata_ws`,
    'tank_status': `${apiBase}/tank_status`,
    'flightsummary': `${apiBase}/flightsummary/get`,
}

export const enableTutorial = booleanEnv("VITE_ENABLE_TUTORIAL", true)

type TransformType<T> = {
    [key: string]: (data: T) => T
}
export const apiTransforms: TransformType<any> = {}

export const geoCoords = {
    'latitude': 'gin_latitude',
    'longitude': 'gin_longitude',
    'altitude': 'pressure_height_kft'
}

export const presets = {
    'True air temperatures (C)': [521, 524],
    'Dew points (C)': [529, 550, 931],
    'Tephigram': [529, 521],
    'Pressure & radar alts (ft)': [579, 977],
    'Neph. SP (Mm-1)': [622, 623, 624],
    'Turbulence Probe': [593, 594, 595]
}

export const plotHeaderDefaults = [
    'gin_latitude', 'gin_longitude', 'pressure_height_kft', 'deiced_true_air_temp_c',
    'dew_point'
]

// Experimental features
export const enableQuicklook = booleanEnv("VITE_ENABLE_QUICKLOOK", false)