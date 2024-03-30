// productSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    loading: false,
    error: null
}

const productSlice = createSlice({
    name: "product",
    initialState: initialState,
    reducers: {
        fetchProductSuccess: (state, action) => {
            state.loading = false;
            state.products = action.payload;
        },
        makeRequest : (state,action) =>{
            state.loading= action.payload;
        },
        makeError: (state,action) =>{
            state.error= action.payload;
        }
    },
    
});

export const { fetchProductSuccess ,makeError,makeRequest } = productSlice.actions;
export default productSlice.reducer; 
