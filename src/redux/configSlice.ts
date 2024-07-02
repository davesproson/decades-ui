import { createSlice } from '@reduxjs/toolkit';

interface ConfigState {
	darkMode: boolean,
	quickLookMode: boolean,
	modeSelected: boolean,
	tabbedPlots: boolean
}

export const configSlice = createSlice({
	name: 'config',
	initialState: {
		darkMode: false,
		quickLookMode: false,
		modeSelected: false,
		tabbedPlots: false
	} as ConfigState,
	reducers: {
		setDarkMode: (state, action) => {
			state.darkMode = action.payload;
		},
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
		setQuickLookMode: (state, action) => {
			state.quickLookMode = action.payload;
			state.modeSelected = true;
		},
		toggleQuickLookMode: (state) => {
			state.quickLookMode = !state.quickLookMode;
		},
		setModeSelected: (state, action) => {
			state.modeSelected = action.payload;
		},
		setTabbedPlots: (state, action) => {
			state.tabbedPlots = action.payload;
		},
		toggleTabbedPlots: (state) => {
			state.tabbedPlots = !state.tabbedPlots;
		},
	},
});   

export const { 
	setDarkMode, toggleDarkMode,
	setQuickLookMode, toggleQuickLookMode,
	setModeSelected, setTabbedPlots, toggleTabbedPlots

} = configSlice.actions;

export default configSlice.reducer;