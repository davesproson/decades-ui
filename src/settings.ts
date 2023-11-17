const deployment = 'dev'

export const serverPrefix = ""
export const serverProtocol = {
    'demo': "https",
    'dev': "http",
    'prod': "http"
}[deployment]

export const base = {
    "demo": "/decades-demo/",
    "dev": "/decades-vista/",
    "prod": "/decades-vista/"
}[deployment]

export const badData = -999.99

export const apiBase = {
    "demo": "/live",
    "dev": "/decades",
    "prod": "/decades"
}[deployment]

export const apiEndpoints = {
    'parameters': `${apiBase}/parano.json`,
    'parameter_availability': `${apiBase}/params/availability`,
    'data': `${apiBase}/livedata`,
    'tank_status': `${apiBase}/tank_status`,
    'flightsummary': `${apiBase}/flightsummary/get`,
}

export const enableTutorial = true

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
