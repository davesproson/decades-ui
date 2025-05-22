import { createSlice } from '@reduxjs/toolkit';

export interface ConfigState {
	darkMode: boolean,
	quickLookMode: boolean,
	modeSelected: boolean,
	tabbedPlots: boolean,
	showOptionsDrawer: boolean
}

export const configSlice = createSlice({
	name: 'config',
	initialState: {
		showOptionsDrawer: false,
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
		setShowOptionsDrawer: (state, action) => {
			state.showOptionsDrawer = action.payload;
		},
		toggleOptionsDrawer: (state) => {
			state.showOptionsDrawer = !state.showOptionsDrawer;
		}
	},
});

export const {
	setDarkMode, toggleDarkMode,
	setQuickLookMode, toggleQuickLookMode,
	setModeSelected, setTabbedPlots, toggleTabbedPlots,
	setShowOptionsDrawer, toggleOptionsDrawer

} = configSlice.actions;

export default configSlice.reducer;