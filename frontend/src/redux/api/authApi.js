import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (body) => ({
                url: '/Register',
                method: 'post',
                body,
            }),
        }),
        loginUser: builder.mutation({
            query: (body) => ({
                url: '/Login',
                method: 'post',
                body,
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getUserProfile.initiate(null))

                }
                catch (error) {
                    console.log(error);
                }
            }
        }),
        logout: builder.query({
            query: () => ({
                url: '/logout',
            }),
        }),
    }),
});

export const { useLoginUserMutation, useRegisterUserMutation, useLazyLogoutQuery } = authApi;
