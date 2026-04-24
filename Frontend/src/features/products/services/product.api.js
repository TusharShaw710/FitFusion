import axios from "axios";


const productApiInstance=axios.create({
    baseURL:"/api/products",
    withCredentials:true
});

export const getSellerProducts=async()=>{
    try {
        const response=await productApiInstance.get("/seller");
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createProduct=async(formData)=>{
    try {
        const response=await productApiInstance.post("/create",formData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteProduct=async(productId)=>{
    try {
        const response=await productApiInstance.delete(`/delete/${productId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllProducts() {
    try{
        const response = await productApiInstance.get("/")
        return response.data
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function getProductById(productId) {
    try{
        const response = await productApiInstance.get(`/product/${productId}`)
        return response.data
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function addProductVariety(productId,formData){
    try {
        const response=await productApiInstance.post(`/add-variant/${productId}`,formData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getProductByCategory(category) {
    try{
        const response = await productApiInstance.get(`/category/${category}`)
        return response.data
    }catch(error){
        console.log(error);
        throw error;
    }
}
