// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { GaugeConfig, GaugePanelProps } from '../gauge/gauge.types';
// import { RowOrColumn } from '../types';


// export const gaugeSlice = createSlice({
// 	name: 'gauges',
// 	initialState: {
//         direction: "row",
//         configs: [] as Array<GaugeConfig>
//     } as GaugePanelProps,
// 	reducers: {
// 		setDirection: (state, action: PayloadAction<{direction: RowOrColumn}>) => {
// 			state.direction = action.payload.direction;
// 		},
//         toggleDirection: (state) => {
//             if(state.direction === "row") {
//                 state.direction = "column";
//             } else {
//                 state.direction = "row";
//             }
//         },
//         addGauge: (state, action: PayloadAction<GaugeConfig>) => {
//             state.configs.push(action.payload);
//         },
//         addGauges: (state, action: PayloadAction<Array<GaugeConfig>>) => {
//             for(const gauge of action.payload) {
//                 state.configs.push(gauge);
//             }
//         },
//         updateNthGauge: (state, action: PayloadAction<{position: number, config: GaugeConfig}>) => {
//             state.configs[action.payload.position] = action.payload.config;
//         },
//         clearGauges: (state) => {
//             state.configs = [];
//         }
// 	},
// });   

// export const { 
//     setDirection, addGauge, toggleDirection, addGauges, updateNthGauge,
//     clearGauges
// } = gaugeSlice.actions;

// export default gaugeSlice.reducer;