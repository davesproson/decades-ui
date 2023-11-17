import { createSlice } from '@reduxjs/toolkit';

export const configSlice = createSlice({
	name: 'config',
	initialState: {darkMode: false},
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