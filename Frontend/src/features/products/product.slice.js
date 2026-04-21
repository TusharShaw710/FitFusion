import {createSlice} from "@reduxjs/toolkit";


const productSlice=createSlice({
    name:"product",
    initialState:{
        products:[],
        allProducts:[],
        selectedProduct:null, // For detail views
        loading:false,
        error:null
    },
    reducers:{
        setProducts:(state,action)=>{
            state.products=action.payload;
        },
        setSelectedProduct:(state,action)=>{
            state.selectedProduct=action.payload;
        },
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        setError:(state,action)=>{
            state.error=action.payload;
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload
        }
    }
});

export const {setProducts,setSelectedProduct,setLoading,setError,setAllProducts}=productSlice.actions;
export default productSlice.reducer;