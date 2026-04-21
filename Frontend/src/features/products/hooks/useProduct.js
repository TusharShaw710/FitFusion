import { getSellerProducts, createProduct, deleteProduct,getAllProducts,getProductById } from "../services/product.api";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setLoading, setError,setAllProducts, setSelectedProduct } from "../product.slice.js";


export const useProduct=()=>{
    const dispatch=useDispatch();
    const {products,loading,error,selectedProduct}=useSelector((state)=>state.product);

    const handleFetchSellerProducts=async()=>{
        dispatch(setLoading(true));
        try {
            const response=await getSellerProducts();
            dispatch(setProducts(response.products));
            
        } catch (error) {
            console.log(error);
            throw error;
            
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    const handleCreateProduct=async(formData)=>{
        dispatch(setLoading(true));
        try {
            const response=await createProduct(formData);
            dispatch(setProducts(response.products));
            
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleDeleteProduct=async(productId)=>{
        dispatch(setLoading(true));
        try {
            await deleteProduct(productId);
            // Refresh products
            await handleFetchSellerProducts();
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleFetchAllProducts = async () => {
        dispatch(setLoading(true));
        try {
            const response = await getAllProducts();
            dispatch(setAllProducts(response.products));
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
    
    const handleGetProductById=async(productId)=>{
        dispatch(setLoading(true));
        try {
            const response=await getProductById(productId);
            dispatch(setSelectedProduct(response.product));
            
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }
    return {products,loading,error,selectedProduct,handleFetchSellerProducts,handleCreateProduct, handleDeleteProduct,handleFetchAllProducts,handleGetProductById};
}