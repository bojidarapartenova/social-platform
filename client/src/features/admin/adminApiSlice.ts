import { apiSlice } from "../../app/apiSlice";

export interface AdminStats {
    totalUsers: number;
    totalPosts: number;
    totalGroups: number;
    totalComments: number;
    newUsersThisWeek: number;
}

export interface AdminUser {
    _id: string;
    username: string;
    name?: string;
    email: string;
    role: "user" | "admin";
    avatarUrl?: string;
    createdAt: string;
}

export interface AdminPost {
    _id: string;
    authorId: { _id: string; username: string; avatarUrl?: string };
    type: "photo" | "text";
    caption: string;
    groupId?: { _id: string; name: string } | null;
    createdAt: string;
}

export interface AdminGroup {
    _id: string;
    name: string;
    avatarUrl?: string;
    ownerId: { _id: string; username: string };
    createdAt: string;
}

export interface AdminComment {
    _id: string;
    authorId: { _id: string; username: string };
    text: string;
    createdAt: string;
}

interface Paginated<T> {
    total: number;
    page: number;
    limit: number;
}

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStats: builder.query<AdminStats, void>({
            query: () => "/admin/stats",
        }),
        getAdminUsers: builder.query<{ users: AdminUser[] } & Paginated<AdminUser>, { search?: string; page?: number }>({
            query: ({ search = "", page = 1 }) => `/admin/users?search=${encodeURIComponent(search)}&page=${page}`,
            providesTags: ["AdminUser"],
        }),
        setUserRole: builder.mutation<AdminUser, { id: string; role: "user" | "admin" }>({
            query: ({ id, role }) => ({ url: `/admin/users/${id}/role`, method: "PUT", body: { role } }),
            invalidatesTags: ["AdminUser"],
        }),
        deleteUserAsAdmin: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
            invalidatesTags: ["AdminUser", "Post", "GroupList"],
        }),
        getAdminPosts: builder.query<{ posts: AdminPost[] } & Paginated<AdminPost>, { page?: number }>({
            query: ({ page = 1 }) => `/admin/posts?page=${page}`,
            providesTags: ["AdminPost"],
        }),
        deletePostAsAdmin: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/admin/posts/${id}`, method: "DELETE" }),
            invalidatesTags: ["AdminPost", "Post"],
        }),
        getAdminGroups: builder.query<{ groups: AdminGroup[] } & Paginated<AdminGroup>, { page?: number }>({
            query: ({ page = 1 }) => `/admin/groups?page=${page}`,
            providesTags: ["AdminGroup"],
        }),
        deleteGroupAsAdmin: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/admin/groups/${id}`, method: "DELETE" }),
            invalidatesTags: ["AdminGroup", "GroupList", "Post"],
        }),
        getAdminComments: builder.query<{ comments: AdminComment[] } & Paginated<AdminComment>, { page?: number }>({
            query: ({ page = 1 }) => `/admin/comments?page=${page}`,
            providesTags: ["AdminComment"],
        }),
        deleteCommentAsAdmin: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/admin/comments/${id}`, method: "DELETE" }),
            invalidatesTags: ["AdminComment", "Comment"],
        }),
    }),
});

export const {
    useGetAdminStatsQuery, useGetAdminUsersQuery, useSetUserRoleMutation, useDeleteUserAsAdminMutation,
    useGetAdminPostsQuery, useDeletePostAsAdminMutation,
    useGetAdminGroupsQuery, useDeleteGroupAsAdminMutation,
    useGetAdminCommentsQuery, useDeleteCommentAsAdminMutation,
} = adminApiSlice;