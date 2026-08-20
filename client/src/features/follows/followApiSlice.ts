import { apiSlice } from "../../app/apiSlice";

export interface FollowUser {
    _id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
    isFollowedByMe: boolean;
    isSelf: boolean;
}

export const followApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        followUser: builder.mutation<{ message: string }, string>({
            query: (userId) => ({ url: `/follows/${userId}`, method: "POST" }),
            invalidatesTags: (_r, _e, userId) => [{ type: "User", id: userId }, "FollowList"],
        }),
        unfollowUser: builder.mutation<{ message: string }, string>({
            query: (userId) => ({ url: `/follows/${userId}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, userId) => [{ type: "User", id: userId }, "FollowList"],
        }),
        getFollowers: builder.query<FollowUser[], string>({
            query: (userId) => `/follows/${userId}/followers`,
            providesTags: ["FollowList"],
        }),
        getFollowing: builder.query<FollowUser[], string>({
            query: (userId) => `/follows/${userId}/following`,
            providesTags: ["FollowList"],
        }),
        getFriends: builder.query<FollowUser[], void>({
            query: () => "/follows/friends",
            providesTags: ["FollowList"],
        }),
    }),
});

export const {
    useFollowUserMutation, useUnfollowUserMutation, useGetFollowersQuery, useGetFollowingQuery, useGetFriendsQuery
} = followApiSlice;