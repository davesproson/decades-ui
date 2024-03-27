import { createSlice } from '@reduxjs/toolkit';

interface QuicklookState {
	qcJob: string | null,
	flightNumber: string | null,
}

export const quicklookSlice = createSlice({
	name: 'quicklook',
	initialState: {
		qcJob: null,
		flightNumber: null,
	} as QuicklookState,
	reducers: {
		setQcJob: (state, action) => {
			state.qcJob = action.payload;
		},
		setFlightNumber: (state, action) => {
			state.flightNumber = action.payload;
		},
	},
});   

export const { 
	setQcJob, setFlightNumber

} = quicklookSlice.actions;

export default quicklookSlice.reducer;