import { createSlice } from '@reduxjs/toolkit';
import { PlotViewConfig } from '../views/views.types';



type TabsState = {
	tabs: Array<PlotViewConfig>,
	selectedTab: number
}


export const tabbedPlotsSlice = createSlice({
	name: 'tabs',
	initialState: {
		tabs: [],
		selectedTab: 0
	} as TabsState,
	reducers: {
		addTab: (state, action) => {
			state.tabs.push(action.payload);
			state.selectedTab = state.tabs.length;
		},
		removeTab: (state, action) => {
			state.tabs.splice(action.payload - 1, 1);
			state.selectedTab = state.selectedTab - 1;
		},
		selectTab: (state, action) => {
			state.selectedTab = action.payload;
		}
	},
});   

export const { 
	addTab, removeTab, selectTab
} = tabbedPlotsSlice.actions;

export default tabbedPlotsSlice.reducer;