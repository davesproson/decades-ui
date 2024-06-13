import { createSlice } from '@reduxjs/toolkit';
import { PlotViewConfig } from '../views/views.types';

type NamedConfig = {name: string} & (
	PlotViewConfig
)

type TabsState = {
	tabs: Array<NamedConfig>,
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
			state.selectedTab = 0;
		},
		selectTab: (state, action) => {
			state.selectedTab = action.payload;
		},
		renameTab: (state, action) => {
			state.tabs[action.payload.index].name = action.payload.name;
		}
	},
});   

export const { 
	addTab, removeTab, selectTab, renameTab
} = tabbedPlotsSlice.actions;

export default tabbedPlotsSlice.reducer;