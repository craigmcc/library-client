// store ---------------------------------------------------------------------

// Global Redux store definition.

// External Modules ----------------------------------------------------------

import {configureStore, Action, ThunkAction} from '@reduxjs/toolkit';

// Internal Modules ----------------------------------------------------------

import {LibraryApi} from "../features/library/LibraryApi";
import {UserApi} from "../features/user/UserApi";
import counterReducer from '../features/counter/counterSlice';

// Public Objects ------------------------------------------------------------

export const store = configureStore({
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
        .concat(LibraryApi.middleware)
        .concat(UserApi.middleware);
  },
  reducer: {
    [LibraryApi.reducerPath]: LibraryApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
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
