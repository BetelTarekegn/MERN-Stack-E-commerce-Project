import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery,
  endpoints: (builder) => ({

    myOrders: builder.query({
      query: () => '/me/orders',

    }),
    verifyAndCreateOrder: builder.mutation({
      query: (data) => ({
        url: '/order/verify-and-create',
        method: 'POST',
        body: data,
      }),
    }),

  }),


});

export const { useMyOrdersQuery, useVerifyAndCreateOrderMutation } = orderApi;
