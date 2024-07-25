import { createSlice } from '@reduxjs/toolkit';
import { PlotViewConfig } from '@/views/types';
import { genId } from '@/utils';

type NamedConfig = {name: string} & (
	PlotViewConfig
)

type TabsState = {
	tabs: Array<NamedConfig & {id: string}>,
	selectedTab: string
}


export const tabbedPlotsSlice = createSlice({
	name: 'tabs',
	initialState: {
		tabs: [],
		selectedTab: 'param-list'
	} as TabsState,
	reducers: {
		addTab: (state, action) => {
			if(!action.payload?.name) {
				action.payload.name = `Plot ${state.tabs.length + 1}`;
			}
			action.payload.id = genId();
			state.tabs.push(action.payload);
			state.selectedTab = action.payload.id;
		},
		removeTab: (state, action) => {
			state.tabs.splice(action.payload, 1);
			state.selectedTab = 'param-list';
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