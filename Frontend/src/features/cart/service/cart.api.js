import axios from "axios";


const cartInstanceApi=axios.create({
    baseURL:"/api/cart",
    withCredentials:true
});


export const fetchCartApi=async()=>{
    try{
        const response=await cartInstanceApi.get("/");

        return response.data;
    }catch(error){
        throw error;
    }
}

export const addToCartApi=async(productId,variantId,quantity=1)=>{
    try{

        const response=await cartInstanceApi.post(`/add/${productId}/${variantId}`,{quantity});

        return response.data;
        
    }catch(error){
        throw error;
    }
}

export const incrementCartItemQuantityApi=async(productId,variantId)=>{
    try{
        const response=await cartInstanceApi.patch(`/increment/${productId}/${variantId}`);

        return response.data;
    }catch(error){
        throw error;
    }
}

export const decrementCartItemQuantityApi=async(productId,variantId)=>{
    try{
        const response=await cartInstanceApi.patch(`/decrement/${productId}/${variantId}`);

        return response.data;
    }catch(error){
        throw error;
    }
}

export const removeFromCartApi=async(variantId)=>{
    try{
        const response=await cartInstanceApi.delete(`/remove/${variantId}`);

        return response.data;
    }catch(error){
        throw error;
    }
}