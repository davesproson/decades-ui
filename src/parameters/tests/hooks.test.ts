import { renderHookWithStore } from "@/tests";
import { useGetParameters, useParameterEndpoint } from "../hooks";
import { describe, it, expect, vi } from "vitest";
import { waitFor, act } from "@testing-library/react";

import { apiEndpoints } from "@/settings";
import { setParamSet } from "@/redux/parametersSlice";
import { setQuickLookMode } from "@/redux/configSlice";
import { setQcJob } from "@/redux/quicklookSlice";

const mocks = vi.hoisted(() => ({
    fetch: vi.fn(),
}));

vi.mock('@/utils', async () => ({
    authFetch: mocks.fetch
}));

describe("Test useParameterEndpoint hook", async () => {

    it("Should return the parameter endpoint if quicklook mode is false", async () => {
        const { result } = renderHookWithStore(() => useParameterEndpoint(false))
        await waitFor(() => expect(result.current).toBe(apiEndpoints.parameters))
    });

    it("Should return the parameter availability endpoint if 'withAvailability' is true", async () => {
        const { result } = renderHookWithStore(() => useParameterEndpoint(true))
        await waitFor(() => expect(result.current).toBe(apiEndpoints.parameter_availability))
    });

    it("Should include the parameter set in the endpoint if it is set", async () => {
        const { store, result } = renderHookWithStore(() => useParameterEndpoint(false))
        act(() => store.dispatch(setParamSet("test")))
        await waitFor(() => expect(result.current).toBe(`${apiEndpoints.parameters}?params=test`))
    })

    it("Should return the quicklook endpoint if quicklook mode is enabled", async () => {
        const { store, result } = renderHookWithStore(() => useParameterEndpoint(false))

        act(() => {
            store.dispatch(setQcJob(1))
            store.dispatch(setQuickLookMode(true))
        })
        await waitFor(() => expect(result.current).toBe(`${apiEndpoints.quicklook_jobs}/1/`))
    })
});

describe("Test useGetParameters hook", async () => {

    const liveParameters = [{
        "ParameterIdentifier": "576",
        "ParameterName": "static_pressure",
        "DisplayText": "Static Pressure",
        "DisplayUnits": "hPa"
    }]

    const quicklookParameters = {
        variables: [{
            name: "static_pressure",
            long_name: "Static Pressure"
        }]
    }

    const correctedQuicklookParameters = [{
        "ParameterIdentifier": "static_pressure",
        "ParameterName": "static_pressure",
        "DisplayText": "Static Pressure",
        "DisplayUnits": "unit",
        "available": true
    }]

    it("Should return the correct parameters in live mode", async () => {
        mocks.fetch.mockResolvedValueOnce({ json: () => liveParameters})
        const { result } = renderHookWithStore(useGetParameters)
        await waitFor(() => expect(result.current).toStrictEqual(liveParameters))
    });

    it("Should return the correct parameters in quicklook mode", async () => {
        mocks.fetch.mockResolvedValueOnce({ json: () => liveParameters})
        const { store, result } = renderHookWithStore(useGetParameters)
        mocks.fetch.mockResolvedValueOnce({ json: () => quicklookParameters})
        
        act(() => {
            store.dispatch(setQcJob(1))
            store.dispatch(setQuickLookMode(true))
        })
        
        await waitFor(() => expect(result.current).toStrictEqual(correctedQuicklookParameters))
    });
});