import { createSlice } from '@reduxjs/toolkit';

interface QuicklookState {
	qcJob: string | null,
	flightNumber: string | null,
	baseTime: number | null,
	dataTimeSpan: {start: number, end: number} | null,
}

export const quicklookSlice = createSlice({
	name: 'quicklook',
	initialState: {
		qcJob: null,
		flightNumber: null,
		baseTime: null,
		dataTimeSpan: null
	} as QuicklookState,
	reducers: {
		setQcJob: (state, action) => {
			state.qcJob = action.payload;
		},
		setFlightNumber: (state, action) => {
			state.flightNumber = action.payload;
		},
		setBasetime: (state, action) => {
			state.baseTime = action.payload;
		},
		setDataTimeSpan: (state, action) => {
			state.dataTimeSpan = action.payload;
		}
	},
});   

export const { 
	setQcJob, setFlightNumber, setBasetime, setDataTimeSpan

} = quicklookSlice.actions;

export default quicklookSlice.reducer;