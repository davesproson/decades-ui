export const startTime = new Date("2021-04-05T11:12:13.000Z").getTime()
export const stopTime = new Date("2021-04-05T14:15:16.000Z").getTime()

export const RunFlightSummary = {
    "uuid": 0,
    "event": "Run 1",
    "modified": 1617630000,
    "start": {
        "time": startTime,
        "latitude": 0,
        "longitude": 0,
        "altitude": 0,
        "heading": 0
    },
    "stop": {
        "time": stopTime,
        "latitude": 0,
        "longitude": 0,
        "altitude": 0,
        "heading": 0
    },
    "ongoing": true,
    "comment": null
}

export const ProfileFlightSummary = {
    "uuid": 1,
    "event": "Profile 1",
    "modified": 1617630000,
    "start": {
        "time": startTime,
        "latitude": 0,
        "longitude": 0,
        "altitude": 0,
        "heading": 0
    },
    "stop": {
        "time": stopTime,
        "latitude": 0,
        "longitude": 0,
        "altitude": 0,
        "heading": 0
    },
    "ongoing": true,
    "comment": null
}

export const OrbitFlightSummary = {
    "uuid": 2,
    "event": "Orbit 1",
    "modified": 1617630000,
    "start": {
        "time": startTime,
        "latitude": 0,
        "longitude": 0,
        "altitude": 0,
        "heading": 0
    },
    "stop": {
        "time": stopTime,
        "latitude": 0,
        "longitude": 0,
        "altitude": 0,
        "heading": 0
    },
    "ongoing": true,
    "comment": null
}

export const GenericFlightSummary = {
    "uuid": 3,
    "event": "Generic 1",
    "modified": 1617630000,
    "start": {
        "time": startTime,
        "latitude": 0,
        "longitude": 0,
        "altitude": 0,
        "heading": 0
    },
    "stop": {
        "time": stopTime,
        "latitude": 0,
        "longitude": 0,
        "altitude": 0,
        "heading": 0
    },
    "ongoing": true,
    "comment": null
}

export const CombinedFlightSummary = {
    0: RunFlightSummary,
    1: ProfileFlightSummary,
    2: OrbitFlightSummary,
    3: GenericFlightSummary
}