import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TutorialState {
    position: number,
    show: boolean
}

export const tutorialSlice = createSlice({
	name: 'tutorial',
	initialState: {
        position: 0,
        show: true
    } as TutorialState,
	reducers: {
		incrementPosition: (state) => {
			state.position += 1
		},
        decrementPosition: (state) => {
            state.position -= 1
            if(state.position < 0) {
                state.position = 0;
            }
        },
        setShowTutorial: (state, action: PayloadAction<boolean>) => {
            state.show = action.payload;
            if(!action.payload) {
                window.sessionStorage.setItem('showTutorial', 'false');
            }
        }
	},
});   

export const { incrementPosition, decrementPosition, setShowTutorial } = tutorialSlice.actions;

export default tutorialSlice.reducer;