import { configureStore } from '@reduxjs/toolkit'
import { 
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux'

import paramReducer from './parametersSlice'
import paramFilterReducer from './filterSlice'
import optionsReducer from './optionsSlice'
import viewReducer from './viewSlice'
import tutorialReducer from './tutorialSlice'
import configReducer from './configSlice'
import gaugeReducer from './gaugeSlice'
import quicklookReducer from './quicklookSlice'

const store = configureStore({
  reducer: {
    vars: paramReducer,
    paramfilter: paramFilterReducer,
    options: optionsReducer,
    gauges: gaugeReducer,
    view: viewReducer,
    tutorial: tutorialReducer,
    config: configReducer,
    quicklook: quicklookReducer
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useDispatch: () => AppDispatch = useReduxDispatch
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
export default store