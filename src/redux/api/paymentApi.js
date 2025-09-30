import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery, // your backend base URL
  endpoints: (builder) => ({
    initializePayment: builder.mutation({
      query: (paymentData) => ({
        url: '/pay',
        method: 'POST',
        body: paymentData,
      }),
    }),
    verifyPayment: builder.query({
      query: (tx_ref) => `/verify/${tx_ref}`,
    }),
  }),
});

export const {
  useInitializePaymentMutation,
  useVerifyPaymentQuery
} = paymentApi;