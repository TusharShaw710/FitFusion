import { getSellerProducts, createProduct, deleteProduct } from "../services/product.api";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setLoading, setError } from "../product.slice.js";


export const useProduct=()=>{
    const dispatch=useDispatch();
    const {products,loading,error}=useSelector((state)=>state.product);

    const handleFetchSellerProducts=async()=>{
        dispatch(setLoading(true));
        try {
            const response=await getSellerProducts();
            dispatch(setProducts(response.products));
            
        } catch (error) {
            dispatch(setError(error));
            
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
            dispatch(setError(error));
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
            dispatch(setError(error));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {products,loading,error,handleFetchSellerProducts,handleCreateProduct, handleDeleteProduct};
}