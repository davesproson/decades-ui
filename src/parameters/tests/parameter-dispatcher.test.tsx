import { describe, it, expect, vi } from "vitest"
import { renderWithStore } from "@/tests"
import { ParameterDispatcher } from "../parameter-dispatcher"
import { waitFor } from "@testing-library/react";
import { testFunctions } from "@/redux/parametersSlice";

const mocks = vi.hoisted(() => ({
    fetch: vi.fn(),
}));

vi.mock('@/utils', async () => ({
    authFetch: mocks.fetch
}));

const apiParameters = [{
    "ParameterIdentifier": "576",
    "ParameterName": "static_pressure",
    "DisplayText": "Static Pressure",
    "DisplayUnits": "hPa",
    "available": true
}]

const { paramFromDecadesParam } = testFunctions
const internalParameters = apiParameters.map(
    p => paramFromDecadesParam(p)
)

describe('Test parameter dispatcher', async () => {
    it("Should dispatch parameters to the store", async () => {
        mocks.fetch.mockResolvedValueOnce({ json: () => apiParameters })

        const { store } = renderWithStore(<ParameterDispatcher><></></ParameterDispatcher>)

        await waitFor(() => {
            expect(store.getState().vars.params).toStrictEqual(internalParameters)
        })
    })
})