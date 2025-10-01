import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery,
    tagTypes:["Products,AdminProducts"],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: '/Products',
                params: {
                    page: params?.page,
                    keyword: params?.keyword,
                    category: params?.category,

                    "price[gte]": params.min,
                    "price[lte]": params.max,
                    ratings: params?.ratings

                },
            }),
            keepUnusedDataFor: 30,
        }),

        getProductDetails: builder.query({
            query: (_id) => `/products/${_id}`,
        }),
        getAdminProducts: builder.query({
            query: () => `/admin/products`,
            providesTags: ["AdminProducts"]
        }),
        newProduct: builder.mutation({
            query(body) {
                return {
                    url: `/admin/products`,
                    method: "POST",
                    body,
                };
        },
        invalidatesTags: ["AdminProducts"],
        
        }),
          updatedProduct: builder.mutation({
            query({id,body}) {
                return {
                    url: `/admin/products/${id}`,
                    method: "PUT",
                    body,
                };
        },
        invalidatesTags: ["Products","AdminProducts"],
        
        }),
        uploadProductImages: builder.mutation({
            query({id,body}) {
                return {
                    url: `/admin/products/${id}/upload_images`,
                    method: "PUT",
                    body,
                };
        },
        invalidatesTags: ["Products","AdminProducts"],
        
        }),
       deleteProductImage : builder.mutation({
            query({id,body}) {
                return {
                    url: `/admin/Products/${id}/delete_image`,
                    method: "DELETE",
                    body,
                };
        },
        invalidatesTags: ["Products","AdminProducts"],
        
        }),
    }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery, useGetAdminProductsQuery, useNewProductMutation,useUpdatedProductMutation,useUploadProductImagesMutation,useDeleteProductImageMutation} = productApi;