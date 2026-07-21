import { apiSlice } from "../../app/apiSlice";

export const followApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        followUser: builder.mutation<{ message: string }, string>({
            query: (userId) => ({ url: `/follows/${userId}`, method: "POST" }),
            invalidatesTags: (_r, _e, userId) => [{ type: "User", id: userId }],
        }),
        unfollowUser: builder.mutation<{ message: string }, string>({
            query: (userId) => ({ url: `/follows/${userId}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, userId) => [{ type: "User", id: userId }],
        }),
    }),
});

export const { useFollowUserMutation, useUnfollowUserMutation } = followApiSlice;