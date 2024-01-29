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
            const storageKey = 'vistaTutorialSeen'
            state.show = action.payload;
            if(!action.payload) {
                window.sessionStorage.setItem(storageKey, 'true');
            } else {
                window.sessionStorage.removeItem(storageKey);
            }
        }
	},
});   

export const { incrementPosition, decrementPosition, setShowTutorial } = tutorialSlice.actions;

export default tutorialSlice.reducer;