import { createSlice } from '@reduxjs/toolkit';

export type QuicklookJob = {
	flightNumber: string,
	flightDate: string,
	flightProject: string,
	jobID: number
}

export interface QuicklookState {
	qcJob: number | null,
	qcJobs: QuicklookJob[] | null,
	flightNumber: string | null,
	baseTime: number | null,
	dataTimeSpan: {start: number, end: number} | null,
}

export const quicklookSlice = createSlice({
	name: 'quicklook',
	initialState: {
		qcJob: null,
		qcJobs: null,
		flightNumber: null,
		baseTime: null,
		dataTimeSpan: null
	} as QuicklookState,
	reducers: {
		setQcJob: (state, action: {type: string, payload: number|null}) => {
			state.qcJob = action.payload;
		},
		setQcJobs: (state, action: {type: string, payload: QuicklookJob[]}) => {
			state.qcJobs = action.payload;
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
	setQcJob, setQcJobs, setFlightNumber, setBasetime, setDataTimeSpan

} = quicklookSlice.actions;

export default quicklookSlice.reducer;