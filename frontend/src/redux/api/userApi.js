import { createApi } from '@reduxjs/toolkit/query/react';
import { setisAuthenticated, setUser, setLoading } from '../features/userSlice';
import { baseQuery } from './baseQuery';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => '/getUserProfile',
            transformResponse: (result) => result.user,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data));
                    dispatch(setisAuthenticated(true));
                    dispatch(setLoading(false));

                }
                catch (error) {
                    dispatch(setLoading(false));
                    console.log(error)
                }

            },

            providesTags: ["User"]
        }),

        updateProfile: builder.mutation({
            query: (body) => ({
                url: '/me/update_profile',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ["User"],
        }),
        uploadAvatar: builder.mutation({
            query: (body) => ({
                url: '/me/upload_avatar',
                method: 'PUT',
                body,
            }),


        }),
        updatePassword: builder.mutation({
            query: (body) => ({
                url: '/me/update_password',
                method: 'PUT',
                body,
            }),

        }),
        forgotPassword: builder.mutation({
            query: (body) => ({
                url: "/password/forgot",
                method: 'POST',
                body,
            }),

        }),
        resetPassword: builder.mutation({
            query: ({ token, body }) => ({
                url: `/password/reset/${token}`,
                method: 'PUT',
                body,
            }),
        }),
    }),
});




export const { useGetUserProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation, useUpdatePasswordMutation, useForgotPasswordMutation, useResetPasswordMutation } = userApi;