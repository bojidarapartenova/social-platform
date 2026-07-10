import { apiSlice } from "../../app/apiSlice";

export interface Post {
    _id: string;
    authorId: { _id: string; username: string; name?: string; avatarUrl?: string };
    type: "photo" | "text";
    caption: string;
    mediaUrls: string[];
    filter: "none" | "negative" | "blur" | "sobel";
    groupId: string | null;
    createdAt: string;
}

interface CreatePostInput {
    type: "photo" | "text";
    caption?: string;
    mediaUrls?: string[];
    filter?: "none" | "negative" | "blur" | "sobel";
}

export const postApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFeed: builder.query<Post[], void>({
            query: () => "/posts/feed",
            providesTags: ["Post"],
        }),
        createPost: builder.mutation<Post, CreatePostInput>({
            query: (body) => ({ url: "/posts", method: "POST", body }),
            invalidatesTags: ["Post"],
        }),
    }),
});

export const { useGetFeedQuery, useCreatePostMutation } = postApiSlice;