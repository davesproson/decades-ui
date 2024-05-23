import { createSlice } from '@reduxjs/toolkit';

interface ConfigState {
	darkMode: boolean,
	quickLookMode: boolean,
	modeSelected: boolean
}

export const configSlice = createSlice({
	name: 'config',
	initialState: {
		darkMode: false,
		quickLookMode: false,
		modeSelected: false
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
		}
	},
});   

export const { 
	setDarkMode, toggleDarkMode,
	setQuickLookMode, toggleQuickLookMode,
	setModeSelected

} = configSlice.actions;

export default configSlice.reducer;