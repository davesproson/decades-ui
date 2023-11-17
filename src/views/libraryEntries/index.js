import { corechemDiagnostics } from "./chemistry/diagnostics"
import { basicMet } from "./meteorology/basicMet"
import { tephiProfiles } from "./meteorology/tephiProfiles"
import { positionAttitude } from "./aircraft/positionAttitude"

export const libraryViews = [
    basicMet,
    positionAttitude,
    tephiProfiles,
    corechemDiagnostics
]