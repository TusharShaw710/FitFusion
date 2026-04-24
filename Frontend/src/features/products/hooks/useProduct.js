import { getSellerProducts, createProduct, deleteProduct,getAllProducts,getProductById,addProductVariety,getProductByCategory } from "../services/product.api";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setLoading, setError,setAllProducts, setSelectedProduct,setProductByCategory } from "../product.slice.js";
import { useToast } from "../../ui/toast/useToast";


export const useProduct=()=>{
    const dispatch=useDispatch();
    const {products,loading,error,selectedProduct,productByCategory}=useSelector((state)=>state.product);
    const { showToast } = useToast();

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
            showToast({ message: response.message, type: 'success' });
            
        } catch (error) {
            showToast({ message: error.response?.data?.message || "Failed to create product", type: 'error' });
            console.log(error);
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleDeleteProduct=async(productId)=>{
        dispatch(setLoading(true));
        try {
            const response=await deleteProduct(productId);
            await handleFetchSellerProducts();
            showToast({ message: response.message, type: 'success' });
        } catch (error) {
            showToast({ message: error.response?.data?.message || "Failed to delete product", type: 'error' });
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

    const handleAddProductVariety=async(productId,formData)=>{
        dispatch(setLoading(true));
        try {
            const response=await addProductVariety(productId,formData);
            dispatch(setSelectedProduct(response.product));
            
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleGetProductByCategory=async(category)=>{
        dispatch(setLoading(true));
        try {
            const response=await getProductByCategory(category);
            dispatch(setProductByCategory(response.products));
            
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            dispatch(setLoading(false));
        }

    }
    return {
        products,
        loading,
        error,
        selectedProduct,
        productByCategory,
        handleFetchSellerProducts,
        handleCreateProduct,
        handleDeleteProduct,
        handleFetchAllProducts,
        handleGetProductById,
        handleAddProductVariety,
        handleGetProductByCategory
    };
}