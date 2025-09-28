import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const reducerBasePath = "api";

let getClerkGetTokenFunc: () => Promise<string | null>;
export const setClerkGetTokenFunc = (getToken: () => Promise<string | null>) => {
  getClerkGetTokenFunc = getToken;
  console.log("🚀 ~ setClerkGetTokenFunc ~ getClerkGetTokenFunc:", getClerkGetTokenFunc);
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  credentials: "include",
  prepareHeaders: async (headers) => {
    const token = await getClerkGetTokenFunc();
    console.log("🚀 ~ token:", token);
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const rootApiSlice = createApi({
  reducerPath: reducerBasePath,
  baseQuery,
  endpoints: () => ({}),
});
