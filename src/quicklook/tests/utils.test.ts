import { describe, it, expect } from 'vitest'
import { quickLookCompatability } from '../utils'

const quicklookParameterData = {
    variables: [
        {
            name: 'test1',
            long_name: 'Test 1',
            units: 'K'
        },
        {
            name: 'test2',
            long_name: 'Test 2',
            units: 'm'
        },
    ]
}

const DecadesParameterData = [
    {
        ParameterIdentifier: 'test1',
        ParameterName: 'test1',
        DisplayText: 'Test 1',
        DisplayUnits: 'K',
        available: true
    },
    {
        ParameterIdentifier: 'test2',
        ParameterName: 'test2',
        DisplayText: 'Test 2',
        DisplayUnits: 'm',
        available: true
    }
]

describe('Test quickLookCompatibility', () => {
    it('Should return unmodified data if quicklook is not enabled', () => {
        const result = quickLookCompatability(false)(DecadesParameterData)
        expect(result).toEqual(DecadesParameterData)
    })

    it('Should return transformed data if quicklook is enabled', () => {
        const result = quickLookCompatability(true)(quicklookParameterData)
        expect(result).toEqual(DecadesParameterData)
    })

    it('Should throw an error if data is not in the expected format', () => {
        expect(() => quickLookCompatability(true)(DecadesParameterData)).toThrow("Quicklook data is not in the expected format.")
    })

    it('Should throw an error if quicklook is enabled but data is not in the expected format', () => {
        expect(() => quickLookCompatability(false)(quicklookParameterData)).toThrow("Received quicklook data when not in quicklook mode.")
    })
})