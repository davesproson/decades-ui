import { DecadesParameter } from "@/redux/parametersSlice";

// This is the type of the parameters that are returned from the QC API
// used for quicklook mode
export type QcParameter = {
    name: string,
    long_name: string,
    units: string
}

// This is the type of the response from the QC API
export type QcResponse = {
    variables: Array<QcParameter>
}

// A QCC argument can be either a QcResponse or an array of DecadesParameters
// The type guard isQCResponse can be used to determine which type it is
export type QCCArg = QcResponse | Array<DecadesParameter>
export const isQCResponse = (p: QcResponse | DecadesParameter[]): p is QcResponse => {
    return (p as QcResponse).variables !== undefined;
}

// This is the type of the response from the quicklook job API
export type QuicklookJobResponse = {
    results: QuicklookJobResponseElement[]
}

// This is the type of the elements in the response from the quicklook job API
export type QuicklookJobResponseElement = {
    flight_number: string,
    flight_date: string,
    flight_project: string,
    url: string
}