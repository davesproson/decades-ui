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
	dataTimeSpan: { start: number, end: number } | null,
}

type Payload<P> = {
	type: string,
	payload: P
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
		setQcJob: (state, action: Payload<number | null>) => {
			state.qcJob = action.payload;
		},
		setQcJobs: (state, action: Payload<QuicklookJob[]>) => {
			state.qcJobs = action.payload;
		},
		setFlightNumber: (state, action: Payload<string | null>) => {
			state.flightNumber = action.payload;
		},
		setBasetime: (state, action: Payload<number>) => {
			state.baseTime = action.payload;
		},
		setDataTimeSpan: (state, action: Payload<{ start: number, end: number }>) => {
			state.dataTimeSpan = action.payload;
		}
	},
});

export const {
	setQcJob, setQcJobs, setFlightNumber, setBasetime, setDataTimeSpan

} = quicklookSlice.actions;

export default quicklookSlice.reducer;