import { corechemDiagnostics } from "./chemistry/diagnostics"
import { basicMet } from "./meteorology/basicMet"
import { tephiProfiles } from "./meteorology/tephiProfiles"
import { positionAttitude } from "./aircraft/positionAttitude"
import { LibraryViews } from "../views.types"

export const libraryViews: LibraryViews = [
    basicMet,
    positionAttitude,
    tephiProfiles,
    corechemDiagnostics
]