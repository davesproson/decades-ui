import { DecadesParameter } from '@/redux/parametersSlice'
import type { QCCArg, QcParameter, QcResponse } from './types'
import { isQCResponse } from './types'

/**
 * This function returns a function that can be used to transform the data
 * returned from the parameter availability endpoint. If quicklook mode is enabled,
 * the function will transform the data into an array of DecadesParameters. If
 * quicklook mode is not enabled, the function will return the data as is.
 * 
 * @param quickLookMode Whether quicklook mode is enabled.
 * @returns  A function that can be used to transform the data.
 */
export const quickLookCompatability = (quickLookMode: boolean): (a: QCCArg) => Array<DecadesParameter> => {

    // If in quicklook mode, return a function that transforms the data into
    // an array of DecadesParameters. Use a type guard to ensure that the data
    // is in the correct format.
    if (quickLookMode) {
        return (data: QcResponse | Array<DecadesParameter>) => {
            if (!isQCResponse(data)) {
                throw new Error("Quicklook data is not in the expected format.")
            };
            return data.variables.map((v: QcParameter) => {
                // TODO: Add units to the quicklook data
                // TODO: Should probably use a builder pattern here
                return {
                    'ParameterIdentifier': v.name,
                    'ParameterName': v.name,
                    'DisplayText': v.long_name,
                    'DisplayUnits': v.units || '-',
                    'available': true
                } as DecadesParameter
            })
        }
    }

    // If not in quicklook mode, return the data as is, with a safety check
    // to ensure that the data is not in the quicklook format.
    return (data: QCCArg) => {
        if (isQCResponse(data)) {
            throw new Error("Received quicklook data when not in quicklook mode.")
        }
        return data
    }
}