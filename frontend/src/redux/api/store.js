import { configureStore } from "@reduxjs/toolkit"
import { productApi } from "./productApi" // Make sure the path is correct
import { authApi } from "./authApi";
import { userApi } from "./userApi";
import userReducer from "../features/userSlice";
import cartReducer from "../features/cartSlice";
import { paymentApi } from "./paymentApi";
import {orderApi} from "./orderApi";
import { chatbotApi } from "./chatbotApi"; // ✅ chatbot API
import chatReducer from "../features/chatbotSlice";

 const store = configureStore({
    reducer: {
        auth: userReducer,
        cart: cartReducer,
        chat: chatReducer,
        [productApi.reducerPath]: productApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
         [orderApi.reducerPath]: orderApi.reducer,
         [chatbotApi.reducerPath]: chatbotApi.reducer,
        
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productApi.middleware, authApi.middleware, userApi.middleware, paymentApi.middleware,orderApi.middleware, chatbotApi.middleware ),
});
export default store;