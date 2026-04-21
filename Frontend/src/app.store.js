import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import productReducer from "./features/products/product.slice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product:productReducer
    },
});

export default store;