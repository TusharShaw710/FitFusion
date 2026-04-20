import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./components/auth/auth.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;