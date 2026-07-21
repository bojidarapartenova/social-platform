import { apiSlice } from "../../app/apiSlice";
import type { Post } from "../posts/postApiSlice";

export interface UserProfile {
    _id: string;
    username: string;
    name?: string;
    bio?: string;
    avatarUrl?: string;
    followerCount: number;
    followingCount: number;
    relationshipStatus: "self" | "friend" | "following" | "none";
}

export interface UpdateProfileRequest {
    name?: string;
    bio?: string;
    avatarUrl?: string;
}

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<UserProfile, string>({
            query: (id) => `/users/${id}`,
            providesTags: (_result, _error, id) => [{ type: "User", id }],
        }),
        getUserPosts: builder.query<Post[], string>({
            query: (id) => `/users/${id}/posts`,
            providesTags: ["Post"],
        }),
        updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
            query: (body) => ({
                url: "/users/me",
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result) =>
                result ? [{ type: "User", id: result._id }] : [],
        }),
    }),
});

export const {
    useGetUserQuery,
    useGetUserPostsQuery,
    useUpdateProfileMutation,
} = userApiSlice;