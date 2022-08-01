// store ---------------------------------------------------------------------

// Global Redux store definition.

// External Modules ----------------------------------------------------------

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

// Internal Modules ----------------------------------------------------------

import { ApiSlice } from "../features/api/ApiSlice";
import counterReducer from '../features/counter/counterSlice';

// Public Objects ------------------------------------------------------------

export const store = configureStore({
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
        .concat(ApiSlice.middleware);
  },
  reducer: {
    [ApiSlice.reducerPath]: ApiSlice.reducer,
    counter: counterReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
