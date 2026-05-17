import { createSlice } from "@reduxjs/toolkit";


const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
        products: [],
        watchlist: []
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setWatchlist: (state, action) => {
            state.watchlist = action.payload
        }
    }
})


export const { setSellerProducts, setProducts, setWatchlist } = productSlice.actions
export default productSlice.reducer