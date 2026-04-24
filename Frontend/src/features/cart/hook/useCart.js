import { fetchCartApi,addToCartApi,incrementCartItemQuantityApi,decrementCartItemQuantityApi,removeFromCartApi } from "../service/cart.api";
import { setCartItems,incrementQuantity,decrementQuantity,removeFromCart as removeFromCartAction } from "../state/cart.slice";
import {useDispatch,useSelector} from "react-redux"
import { useToast } from "../../ui/toast/useToast";

export const useCart=()=>{
    const dispatch=useDispatch();
    const { showToast } = useToast();
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
            const response=await addToCartApi(productId,variantId,quantity);
            dispatch(setCartItems(response.cart.items));
            showToast({ message: response.message, type: 'success' });
        }catch(error){
            showToast({ message: error.response?.data?.message || "Failed to add to cart", type: 'error' });
            throw error;
        }
    }

    const incrementCartItemQuantity=async(productId,variantId)=>{
        try{
            const response = await incrementCartItemQuantityApi(productId,variantId);
            dispatch(incrementQuantity({productId,variantId}));
        }catch(error){
            showToast({ message: error.response?.data?.message || "Failed to update quantity", type: 'error' });
            throw error;
        }
    }

    const decrementCartItemQuantity=async(productId,variantId)=>{
        try{
            const response = await decrementCartItemQuantityApi(productId,variantId);
            dispatch(decrementQuantity({productId,variantId}));
        }catch(error){
            showToast({ message: error.response?.data?.message || "Failed to update quantity", type: 'error' });
            throw error;
        }
    }

    const removeFromCart=async(variantId)=>{
        try{
            const response = await removeFromCartApi(variantId);
            dispatch(removeFromCartAction({variantId}));
            showToast({ message: response.message, type: 'success' });
        }catch(error){
            showToast({ message: error.response?.data?.message || "Failed to remove item", type: 'error' });
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