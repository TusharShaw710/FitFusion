import { fetchCartApi,addToCartApi,incrementCartItemQuantityApi,decrementCartItemQuantityApi,removeFromCartApi } from "../service/cart.api";
import { setCartItems, setCartTotal, incrementQuantity, decrementQuantity, removeFromCart as removeFromCartAction } from "../state/cart.slice";
import {useDispatch,useSelector} from "react-redux"
import { useToast } from "../../ui/toast/useToast";

export const useCart=()=>{
    const dispatch=useDispatch();
    const { showToast } = useToast();
    const cartItems=useSelector((state)=>state.cart.cartItems);
    const cartTotal=useSelector((state)=>state.cart.cartTotal);
    const cartCurrency=useSelector((state)=>state.cart.cartCurrency);

    const fetchCart=async()=>{
        try{
            const cartData=await fetchCartApi();
            // Aggregation pipeline returns cart as an array; use the first document
            const cartDoc = cartData.cart[0];
            dispatch(setCartItems(cartDoc.items));
            dispatch(setCartTotal({ total: cartDoc.total, currency: cartDoc.currency }));
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
            await incrementCartItemQuantityApi(productId,variantId);
            // Optimistic: update quantity in store; slice recalculates total
            dispatch(incrementQuantity({productId,variantId}));
        }catch(error){
            showToast({ message: error.response?.data?.message || "Failed to update quantity", type: 'error' });
            throw error;
        }
    }

    const decrementCartItemQuantity=async(productId,variantId)=>{
        try{
            await decrementCartItemQuantityApi(productId,variantId);
            // Optimistic: update quantity in store; slice recalculates total
            dispatch(decrementQuantity({productId,variantId}));
        }catch(error){
            showToast({ message: error.response?.data?.message || "Failed to update quantity", type: 'error' });
            throw error;
        }
    }

    const removeFromCart=async(variantId)=>{
        try{
            const response = await removeFromCartApi(variantId);
            // Optimistic: remove item from store; slice recalculates total
            dispatch(removeFromCartAction({variantId}));
            showToast({ message: response.message, type: 'success' });
        }catch(error){
            showToast({ message: error.response?.data?.message || "Failed to remove item", type: 'error' });
            throw error;
        }
    }

    return {
        cartItems,
        cartTotal,
        cartCurrency,
        fetchCart,
        addToCart,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        removeFromCart
    }
}