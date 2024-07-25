import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServerState {
    // servers: Array<Server>,
    selectedServer: string | null
}

export const serverSlice = createSlice({
	name: 'servers',
	initialState: {
        // servers: [],
        selectedServer: null
    } as ServerState,
	reducers: {
		// setServers: (state, action) => {
        //     state.servers = action.payload.servers;
		// },
        setSelectedServer: (state, action: PayloadAction<{server: string}>) => {
            state.selectedServer = action.payload.server;
        }
	},
});   

export const { setSelectedServer } = serverSlice.actions;

export default serverSlice.reducer;