// redux/api/chatbotApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ message }) => ({
        url: "/chatbot",
        method: "POST",
        body: { message },
      }),
    }),
  }),
});

export const { useSendMessageMutation } = chatbotApi;
