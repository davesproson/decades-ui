import { createSlice } from '@reduxjs/toolkit';
import type { AlarmProps } from '@/alarms/types';
import { genId } from '@/utils';

export type AlarmID = {
    id: string
}

export const alarmSlice = createSlice({
    name: 'alarms',
    initialState: {
        alarms: {} as { [key: string]: AlarmProps }
    },
    reducers: {
        addAlarm: (state, action: { type: string } & { payload: AlarmProps }) => {
            state.alarms[action.payload.id] = action.payload;
        },
        removeAlarm: (state, action: { type: string, payload: AlarmID }) => {
            delete state.alarms[action.payload.id];
        },
        addNewAlarm: (state) => {
            const id = genId();
            state.alarms[id] = {
                name: "New Alarm Name",
                id: id,
                description: "New Alarm Description",
                parameters: [],
                rule: "",
                passingText: "Pass",
                failingText: "Fail",
                failOnNoData: true,
                disableFlash: false,
            }
        },
        modifyAlarm: (state, action: { payload: Partial<AlarmProps> & AlarmID, type: string }) => {
            const alarm = state.alarms[action.payload.id];
            state.alarms[action.payload.id] = {
                ...alarm,
                ...action.payload
            }
        }
    }
})

export const {
    addAlarm,
    removeAlarm,
    addNewAlarm,
    modifyAlarm
} = alarmSlice.actions;

export default alarmSlice.reducer;