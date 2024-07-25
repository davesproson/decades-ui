import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ParamFilterState {
	filterText: string
}

export const paramFilterSlice = createSlice({
	name: 'paramfilter',
	initialState: {filterText: ""} as ParamFilterState,
	reducers: {
		setFilterText: (state, action: PayloadAction<{filterText: string}>) => {
			state.filterText = action.payload.filterText;
		}
	},
});   

export const { setFilterText } = paramFilterSlice.actions;

export default paramFilterSlice.reducer;