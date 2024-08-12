import { testFunctions } from "../hooks"
import { QuicklookJobResponse } from "../types"
const { apiJobToInteralJob } = testFunctions

export const apiJobs: QuicklookJobResponse = {
    results: [{
        flight_number: 'C123',
        flight_date: '2022-01-01',
        flight_project: 'Test',
        url: 'http://test.com/a/b/c/d/1'
    }, {
        flight_number: 'C124',
        flight_date: '2022-01-02',
        flight_project: 'Test 2',
        url: 'http://test.com/a/b/c/d/2'
}]
}

export const internalJobs = apiJobs.results.map(apiJobToInteralJob)

export const dataTimes = {
    start_time_api: 946728000,
    end_time_api: 946728600,
    baseTime: 946684800000
}