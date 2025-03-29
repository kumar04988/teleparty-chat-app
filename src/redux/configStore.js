import rootReducer from './reducers/index';
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(thunk),
});

export default store;
