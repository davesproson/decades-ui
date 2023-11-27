import { createSlice } from '@reduxjs/toolkit';

interface ConfigState {
	darkMode: boolean
}

export const configSlice = createSlice({
	name: 'config',
	initialState: {darkMode: false} as ConfigState,
	reducers: {
		setDarkMode: (state, action) => {
			state.darkMode = action.payload;
		},
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        }
	},
});   

export const { setDarkMode, toggleDarkMode } = configSlice.actions;

export default configSlice.reducer;