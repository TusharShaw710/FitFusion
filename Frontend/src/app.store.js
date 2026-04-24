import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import productReducer from "./features/products/product.slice.js";
import cartReducer from "./features/cart/state/cart.slice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product:productReducer,
        cart:cartReducer
    },
});

export default store;