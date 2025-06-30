import { corechemDiagnostics } from "./chemistry/diagnostics"
import { basicMet } from "./meteorology/basicMet"
import { tephiProfiles } from "./meteorology/tephiProfiles"
import { positionAttitude } from "./aircraft/positionAttitude"
import { LibraryViews } from "@/views/types"
import { TecoSO2 } from "./chemistry/teco-so2"
import { AL55CO } from "./chemistry/al55co"
import { FGGA } from "./chemistry/fgga"
import { TwoBO3 } from "./chemistry/twob-o3"
import { TecoO3 } from "./chemistry/teco-o3"
import { teamXCoreChemDiagnostics } from "./chemistry/diagnostics-teamx"

export const libraryViews: LibraryViews = [
    basicMet,
    positionAttitude,
    tephiProfiles,
    teamXCoreChemDiagnostics,
    corechemDiagnostics,
    TecoSO2,
    AL55CO,
    FGGA,
    TwoBO3,
    TecoO3,
]