// store ---------------------------------------------------------------------

// Global Redux store definition.

// External Modules ----------------------------------------------------------

import {configureStore, Action, ThunkAction} from '@reduxjs/toolkit';

// Internal Modules ----------------------------------------------------------

import {LibraryApi} from "../features/library/LibraryApi";
import counterReducer from '../features/counter/counterSlice';

// Public Objects ------------------------------------------------------------

export const store = configureStore({
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
        .concat(LibraryApi.middleware);
  },
  reducer: {
    [LibraryApi.reducerPath]: LibraryApi.reducer,
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
