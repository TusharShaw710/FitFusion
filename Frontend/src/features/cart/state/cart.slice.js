import {createSlice} from "@reduxjs/toolkit"

// Helper: recalculate total from items array whenever we do an optimistic update
const recalculateTotal = (items) =>
    items.reduce((acc, item) => acc + (item.price.amount * item.quantity), 0);

const cartSlice= createSlice({
    name:"cart",
    initialState:{
        cartItems:[],
        cartTotal: 0,
        cartCurrency: 'INR'
    },
    reducers:{
        setCartItems:(state,action)=>{
            state.cartItems=action.payload;
        },
        // Called after fetchCart to store the server-computed total
        setCartTotal:(state,action)=>{
            state.cartTotal = action.payload.total;
            state.cartCurrency = action.payload.currency || 'INR';
        },
        incrementQuantity:(state,action)=>{
            const {productId,variantId}=action.payload;
            const item=state.cartItems.find(
                item => (item.product._id === productId || item.product === productId) && item.variant === variantId
            )
            if(item){
                item.quantity+=1;
                state.cartTotal = recalculateTotal(state.cartItems);
            }
        },
        decrementQuantity:(state,action)=>{
            const {productId,variantId}=action.payload;
            const item=state.cartItems.find(
                item => (item.product._id === productId || item.product === productId) && item.variant === variantId
            )
            if(item && item.quantity > 0){
                item.quantity-=1;
                state.cartTotal = recalculateTotal(state.cartItems);
            }
        },
        removeFromCart:(state,action)=>{
            const {variantId}=action.payload;
            state.cartItems=state.cartItems.filter(
                item => item.variant !== variantId
            )
            state.cartTotal = recalculateTotal(state.cartItems);
        }
    }
})

export const {setCartItems, setCartTotal, incrementQuantity, decrementQuantity, removeFromCart}=cartSlice.actions;
export default cartSlice.reducer;