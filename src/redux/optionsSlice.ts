import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomTimeframe {
    start: number | null,
    end: number | null
};
export interface CustomTimeframeSetter {
    start?: number | null,
    end?: number | null
}

interface Timeframe {
    selected: boolean,
    value: 'all' | '2hr' | '1hr' | '30min' | '5min' | '1min',
    label: string
};

export type OptionsState = {
    swapOrientation: boolean,
    plotStyle: {
        options: string[],
        value: string
    },
    scrollingWindow: boolean,
    dataHeader: boolean,
    ordinateAxis: string,
    colorVariable: string | null,
    server: string | undefined,
    timeframes: Array<Timeframe>,
    useCustomTimeframe: boolean,
    customTimeframe: CustomTimeframe,
    mask: boolean
};

export const optionsSlice = createSlice({
	name: 'options',
	initialState: {
        swapOrientation: false,
        plotStyle: {
            options: ['line', 'scatter'],
            value: 'line'
        },
        scrollingWindow: false,
        dataHeader: false,
        ordinateAxis: 'utc_time',
        server: undefined,
        colorVariable: null,
        timeframes: [
            {selected: false, value: 'all', label: 'All'},
            {selected: false, value: '2hr', label: '2 hours'},
            {selected: false, value: '1hr', label: '1 hour'},
            {selected: true, value: '30min', label: '30 minutes'},
            {selected: false, value: '5min', label: '5 minutes'},
            {selected: false, value: '1min', label: '1 minute'},
        ],
        useCustomTimeframe: false,
        customTimeframe: {
            start: null,
            end: null
        },
        mask: false
    } as OptionsState,
	reducers: {
        toggleSwapOrientation: (state) => {
            state.swapOrientation = !state.swapOrientation;
        },
        toggleScrollingWindow: (state) => {
            state.scrollingWindow = !state.scrollingWindow;
        },
        toggleDataHeader: (state) => {
            state.dataHeader = !state.dataHeader;
        },
        togglePlotStyle: (state) => {
            if (state.plotStyle.value === state.plotStyle.options[0]) {
                state.plotStyle.value = state.plotStyle.options[1];
            } else {
                state.plotStyle.value = state.plotStyle.options[0];
            }
        },
        togglePlotMask: (state) => {
            state.mask = !state.mask;
        },
        setTimeframe: (state, action: PayloadAction<{value: string}>) => {
 
            const matchedTimeframe = state.timeframes.find(
                x=>x.value===action.payload.value
            )

            if(!matchedTimeframe) {
                console.error(`Invalid timeframe value: ${action.payload.value}`);
                return;
            }

            for(const timeframe of state.timeframes) {
                timeframe.selected = false;
            }

            matchedTimeframe.selected = true;
            

            state.useCustomTimeframe = false;
            state.customTimeframe = {
                start: null,
                end: null
            }
        },
        setCustomTimeframe: (state, action: PayloadAction<CustomTimeframeSetter>) => {
            for(const x of state.timeframes) {
                x.selected = false;
            }
            state.useCustomTimeframe = true;

            if(action.payload.start !== null && action.payload.start != undefined) {
                state.customTimeframe.start = action.payload.start;
            }
            if(action.payload.end !== undefined) {
                state.customTimeframe.end = action.payload.end;
                if(state.customTimeframe.start === null){
                    state.customTimeframe.start = (
                        (action.payload.end || new Date().getTime()) - 30*60*1000
                    )
                }
            }
        },
        setServer: (state, action) => {
            state.server = action.payload;
        },
        setOrdinateAxis: (state, action) => {
            state.ordinateAxis = action.payload;
        },
        setColorVariable: (state, action) => {
            state.colorVariable = action.payload;
        }
	},
});


export const { 
    toggleSwapOrientation, toggleScrollingWindow, toggleDataHeader, togglePlotStyle,
    togglePlotMask,
    setTimeframe, setServer, setOrdinateAxis, setCustomTimeframe, setColorVariable
} = optionsSlice.actions;

export default optionsSlice.reducer;
