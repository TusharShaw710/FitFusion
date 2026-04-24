import {createSlice} from "@reduxjs/toolkit"


const cartSlice= createSlice({
    name:"cart",
    initialState:{
        cartItems:[]
    },
    reducers:{
        setCartItems:(state,action)=>{
            state.cartItems=action.payload;
        },
        incrementQuantity:(state,action)=>{
            const {productId,variantId}=action.payload;
            const item=state.cartItems.find(
                item => (item.product._id === productId || item.product === productId) && item.variant === variantId
            )
            if(item){
                item.quantity+=1;
            }
        },
        decrementQuantity:(state,action)=>{
            const {productId,variantId}=action.payload;
            const item=state.cartItems.find(
                item => (item.product._id === productId || item.product === productId) && item.variant === variantId
            )
            if(item){
                item.quantity-=1;
            }
        },
        removeFromCart:(state,action)=>{
            const {productId,variantId}=action.payload;
            state.cartItems=state.cartItems.filter(
                item => (item.product._id !== productId && item.product !== productId) || item.variant !== variantId
            )
        }
    }
})

export const {setCartItems,incrementQuantity,decrementQuantity,removeFromCart}=cartSlice.actions;
export default cartSlice.reducer;