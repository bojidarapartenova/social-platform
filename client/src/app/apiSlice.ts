import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { logout } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        api.dispatch(logout());
        window.location.href = "/login";
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Post", "User", "Comment", "AdminComment", "Chat", "Message", "Group", "GroupList", "GroupRequests", "GroupMembers", "Notification", "FollowList", "AdminUser", "AdminPost", "AdminGroup"],
    endpoints: () => ({}),
});