import { apiSlice } from "../../app/apiSlice";
import type { Post } from "../posts/postApiSlice";

export interface SearchUser { _id: string; username: string; name?: string; avatarUrl?: string; }
export interface SearchGroup { _id: string; name: string; avatarUrl?: string; description?: string; }

export interface SearchResults {
    users: SearchUser[];
    groups: SearchGroup[];
    posts: Post[];
}

export const searchApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        search: builder.query<SearchResults, string>({
            query: (q) => `/search?q=${encodeURIComponent(q)}`,
        }),
        getPopularPosts: builder.query<Post[], void>({
            query: () => "/posts/popular",
            providesTags: ["Post"],
        }),
    }),
});

export const { useSearchQuery, useGetPopularPostsQuery } = searchApiSlice;