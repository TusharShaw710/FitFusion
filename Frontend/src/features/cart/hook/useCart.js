import { fetchCartApi,addToCartApi,incrementCartItemQuantityApi,decrementCartItemQuantityApi,removeFromCartApi } from "../service/cart.api";
import { setCartItems,incrementQuantity,decrementQuantity,removeFromCart as removeFromCartAction } from "../state/cart.slice";
import {useDispatch,useSelector} from "react-redux"

export const useCart=()=>{
    const dispatch=useDispatch();
    const cartItems=useSelector((state)=>state.cart.cartItems);

    const fetchCart=async()=>{
        try{
            const cartData=await fetchCartApi();
            dispatch(setCartItems(cartData.cart.items));
        }catch(error){
            throw error;
        }
    }

    const addToCart=async(productId,variantId,quantity)=>{
        try{
            const cartData=await addToCartApi(productId,variantId,quantity);
            dispatch(setCartItems(cartData.cart.items));
        }catch(error){
            throw error;
        }
    }

    const incrementCartItemQuantity=async(productId,variantId)=>{
        try{
            await incrementCartItemQuantityApi(productId,variantId);
            dispatch(incrementQuantity({productId,variantId}));
        }catch(error){
            throw error;
        }
    }

    const decrementCartItemQuantity=async(productId,variantId)=>{
        try{
            await decrementCartItemQuantityApi(productId,variantId);
            dispatch(decrementQuantity({productId,variantId}));
        }catch(error){
            throw error;
        }
    }

    const removeFromCart=async(productId,variantId)=>{
        try{
            await removeFromCartApi(productId,variantId);
            dispatch(removeFromCartAction({productId,variantId}));
        }catch(error){
            throw error;
        }
    }

    return {
        cartItems,
        fetchCart,
        addToCart,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        removeFromCart
    }
}