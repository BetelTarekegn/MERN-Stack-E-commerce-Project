// src/api/baseQuery.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    // Sends cookies like JWT token automatically
});