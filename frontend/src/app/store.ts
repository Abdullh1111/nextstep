import { configureStore } from '@reduxjs/toolkit';
import { nextstepApi } from './services/nextstepApi';

export const store = configureStore({
  reducer: {
    [nextstepApi.reducerPath]: nextstepApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(nextstepApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
