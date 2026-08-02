import {combineReducers} from '@reduxjs/toolkit';
import appReducer from './appSlice';
import dataCacheReducer from './dataCacheSlice';

const rootReducer = combineReducers({
  app: appReducer,
  dataCache: dataCacheReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
