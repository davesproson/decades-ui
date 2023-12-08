import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ViewType = (
    "view" | "plot" | "tephi" | "dashboard" | "url" | "timers"
    | "alarms" | "gauge" | "heading" | "pitch" | "roll" | "map" | "clock"
)
type ViewConfigTabType = "BASIC" | "ADVANCED" | "JSON"

interface AdvancedConfig  {
    type: ViewType,
    rows: number,
    columns: number,
    rowPercent: Array<number>,
    columnPercent: Array<number>,
    elements: Array<AdvancedConfig>,
    title?: string,
}

interface ViewState {
    nRows: number,
    nCols: number,
    plots: Array<string>,
    savedViews: Array</* TODO */any>,
    advancedConfig: AdvancedConfig,
    advancedConfigSaved: boolean,
    viewConfigTab: ViewConfigTabType
}


const reducePlots = (state: ViewState) => {
    state.plots = [...state.plots.slice(0, state.nRows * state.nCols)];
}

const addPlots = (state: ViewState) => {
    const nPlots = state.nRows * state.nCols;
    const nPlotsToAdd = nPlots - state.plots.length;
    for (let i = 0; i < nPlotsToAdd; i++) {
        state.plots.push("");
    }
}

export const viewSlice = createSlice({
	name: 'view',
	initialState: {
        nRows: 1,
        nCols: 1,
        plots: [""],
        savedViews: [],
        advancedConfig: {
            "type": "view",
            "title": "",
            "rows": 1,
            "columns": 1,
            "rowPercent": [100],
            "columnPercent": [100],
            "elements": []
        },
        advancedConfigSaved: true,
        viewConfigTab: "ADVANCED"
    } as ViewState,
	reducers: {
        setViewConfigTab: (state, action: PayloadAction<ViewConfigTabType>) => {
            if(!["BASIC", "ADVANCED", "JSON"].includes(action.payload)) {
                state.viewConfigTab = "BASIC";
                return
            }
            state.viewConfigTab = action.payload;
        },
        setAdvancedConfig: (state, action: PayloadAction<AdvancedConfig | null>) => {
            if(action.payload === null) {
                state.advancedConfig = {
                    "type": "view",
                    "title": "",
                    "rows": 1,
                    "columns": 1,
                    "rowPercent": [100],
                    "columnPercent": [100],
                    "elements": []
                }
                return;
            }
            state.advancedConfig = action.payload;
        },
        setAdvancedConfigSaved: (state, action: PayloadAction<boolean>) => {
            state.advancedConfigSaved = action.payload;
        },
		addColumn: (state) => {
            state.nCols += 1;
            addPlots(state);
        },
        addRow: (state) => {
            state.nRows += 1;
            addPlots(state);
        },
        removeColumn: (state) => {
            if (state.nCols > 1) {
                state.nCols -= 1;
                reducePlots(state);
            }
        },
        removeRow: (state) => {
            if (state.nRows > 1) {
                state.nRows -= 1;
                reducePlots(state);
            }
        },
        setPlot: (state, action: PayloadAction<{index: number, url: string}>) => {
            const plots = [...state.plots];
            plots[action.payload.index] = action.payload.url;
            state.plots = plots;
        },
        setConfig: (state, action: PayloadAction<{nRows: number, nCols: number, plots: Array<string>}>) => {
            state.nRows = action.payload.nRows;
            state.nCols = action.payload.nCols;
            state.plots = action.payload.plots;
        },
        reset: (state) => {
            state.nRows = 1;
            state.nCols = 1;
            state.plots = [""];
        },
        saveView: (state, action: PayloadAction<any/* TODO */>) => {
            const savedViews = [...state.savedViews];
            savedViews.push(action.payload);
            state.savedViews = savedViews;
        },
        loadSavedView: (state, action: PayloadAction<{id: string}>) => {
            const savedView = state.savedViews.find(x => x.id === action.payload.id);
            const version = savedView.version;

            switch(version) {
                // TODO: add support for version 1 (is this worth it now?)
                case 2:
                    state.nRows = savedView.nRows;
                    state.nCols = savedView.nCols;
                    state.plots = savedView.plots;
                    break;
                case 3:
                    state.advancedConfig = savedView
            }
        },
        clearSavedViews: (state) => {
            state.savedViews = [];
        }
	},
});   

export const { 
    addColumn, addRow, removeColumn, removeRow, setPlot, reset, saveView, loadSavedView,
    setConfig, clearSavedViews, setAdvancedConfig, setAdvancedConfigSaved, setViewConfigTab
} = viewSlice.actions;

export default viewSlice.reducer;

export type { AdvancedConfig }