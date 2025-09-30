import { createSlice } from "@reduxjs/toolkit";


const initialState = {

    cartItems: (() => {
        try {
            const items = JSON.parse(localStorage.getItem('cartItems'));
            return Array.isArray(items) ? items : [];
        } catch {
            return [];
        }
    })(),
    shippingInfo: (() => {
        try {
            const info = JSON.parse(localStorage.getItem('shippingInfo'));
            return typeof info === 'object' && info !== null ? info : {};
        } catch {
            return {};
        }
    })()
};


export const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {
        setCartItems: (state, action) => {
            const item = action.payload;
            const isItemExist = state.cartItems.find((i) => i.product === item.product);
            if (isItemExist) {
                state.cartItems = state.cartItems.map((i) =>
                    i.product === isItemExist.product ? item : i
                )
            }
            else {
                state.cartItems = [...state.cartItems, item]
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeCartItem: (state, action) => {
            state.cartItems = state?.cartItems?.filter((i) =>
                i.product !== action.payload
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;

            localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
        }
    }
});

export const { setCartItems, removeCartItem, saveShippingInfo } = cartSlice.actions;
export default cartSlice.reducer;
