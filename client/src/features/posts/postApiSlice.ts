import { apiSlice } from "../../app/apiSlice";

export interface MediaItem {
    url: string;
    filter: "none" | "negative" | "blur" | "sobel";
}

export interface Comment {
    _id: string;
    postId: string;
    authorId: { _id: string; username: string; avatarUrl?: string };
    text: string;
    createdAt: string;
}

export interface PostGroup {
    _id: string;
    name: string;
    avatarUrl?: string;
    ownerId: string;
}

export interface Post {
    _id: string;
    authorId: { _id: string; username: string; name?: string; avatarUrl?: string };
    type: "photo" | "text";
    caption: string;
    media: MediaItem[];
    groupId: PostGroup | null;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    favoriteCount: number;
    likedByMe: boolean;
    favoritedByMe: boolean;
}

interface CreatePostInput {
    type: "photo" | "text";
    caption?: string;
    media?: MediaItem[];
    groupId?: string;
}

export const postApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFeed: builder.query<Post[], "all" | "following" | void>({
            query: (scope) => `/posts/feed?scope=${scope ?? "all"}`,
            providesTags: ["Post"],
        }),
        getFavoritePosts: builder.query<Post[], void>({
            query: () => "/posts/favorites",
            providesTags: ["Post"],
        }),
        createPost: builder.mutation<Post, CreatePostInput>({
            query: (body) => ({ url: "/posts", method: "POST", body }),
            invalidatesTags: ["Post"],
        }),
        updatePost: builder.mutation<Post, { id: string; data: Partial<CreatePostInput> }>({
            query: ({ id, data }) => ({ url: `/posts/${id}`, method: "PUT", body: data }),
            invalidatesTags: ["Post"],
        }),
        deletePost: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
            invalidatesTags: ["Post"],
        }),
        getComments: builder.query<Comment[], string>({
            query: (postId) => `/posts/${postId}/comments`,
            providesTags: (_result, _error, postId) => [{ type: "Comment", id: postId }],
        }),
        addComment: builder.mutation<Comment, { postId: string; text: string }>({
            query: ({ postId, text }) => ({ url: `/posts/${postId}/comments`, method: "POST", body: { text } }),
            invalidatesTags: (_result, _error, { postId }) => [{ type: "Comment", id: postId }, "Post"],
        }),
        deleteComment: builder.mutation<{ message: string }, { id: string; postId: string }>({
            query: ({ id }) => ({ url: `/comments/${id}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, { postId }) => [{ type: "Comment", id: postId }, "Post"],
        }),
        toggleLike: builder.mutation<{ liked: boolean; likeCount: number }, string>({
            query: (postId) => ({ url: `/posts/${postId}/likes`, method: "POST" }),
            invalidatesTags: ["Post"],
            async onQueryStarted(postId, { dispatch, queryFulfilled }) {
                const patchFeed = dispatch(
                    postApiSlice.util.updateQueryData("getFeed", undefined, (draft) => {
                        const post = draft.find((p) => p._id === postId);
                        if (post) {
                            post.likedByMe = !post.likedByMe;
                            post.likeCount += post.likedByMe ? 1 : -1;
                        }
                    })
                );
                const patchFavs = dispatch(
                    postApiSlice.util.updateQueryData("getFavoritePosts", undefined, (draft) => {
                        const post = draft.find((p) => p._id === postId);
                        if (post) {
                            post.likedByMe = !post.likedByMe;
                            post.likeCount += post.likedByMe ? 1 : -1;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchFeed.undo();
                    patchFavs.undo();
                }
            },
        }),
        toggleFavorite: builder.mutation<{ favorited: boolean }, string>({
            query: (postId) => ({ url: `/posts/${postId}/favorites`, method: "POST" }),
            invalidatesTags: ["Post"],
            async onQueryStarted(postId, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    postApiSlice.util.updateQueryData("getFeed", "all", (draft) => {
                        const post = draft.find((p) => p._id === postId);
                        if (post) {
                            post.favoritedByMe = !post.favoritedByMe;
                            post.favoriteCount += post.favoritedByMe ? 1 : -1;
                        }
                    })
                );
                try { await queryFulfilled; } catch { patch.undo(); }
            },
        }),
        getPostsByTag: builder.query<Post[], string>({
            query: (tag) => `/posts/tag/${tag}`,
            providesTags: ["Post"],
        }),
    }),
});

export const {
    useGetFeedQuery,
    useGetFavoritePostsQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useToggleLikeMutation,
    useGetCommentsQuery,
    useAddCommentMutation,
    useToggleFavoriteMutation,
    useDeleteCommentMutation,
    useGetPostsByTagQuery
} = postApiSlice;