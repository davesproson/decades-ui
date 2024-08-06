import { Parameter } from "@/redux/parametersSlice"
import { TabEntry } from "@/redux/tabsSlice"

export const testParameters: Parameter[] = [
    {
        id: 1,
        name: "Parameter 1",
        raw: "param1",
        units: "m/s",
        status: true,
        selected: true,
        axisId: null
    },
    {
        id: 2,
        name: "Parameter 2",
        raw: "param2",
        units: "m",
        status: false,
        selected: false,
        axisId: null
    },
    {
        id: 3,
        name: "Parameter 3",
        raw: "param3",
        units: "K",
        status: null,
        selected: false,
        axisId: null
    }
]

export const testTab: TabEntry = {
    id: "test-tab",
    name: "Test Tab",
    params: ["param1"],
    axes: ["param1"],
    timeframe: "1h",
    style: "line",
    scrolling: true,
    header: false,
    ordvar: "utc_time",
    swapxy: false,
    job: null
}