import { apiSlice } from "../../app/apiSlice";

export interface AppNotification {
    _id: string;
    recipientId: string;
    actorId: { _id: string; username: string; avatarUrl?: string };
    type: "like" | "comment" | "follow" | "group_invite" | "message";
    entityRef?: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<AppNotification[], void>({
            query: () => "/notifications",
            providesTags: ["Notification"],
        }),
        getUnreadCount: builder.query<{ count: number }, void>({
            query: () => "/notifications/unread-count",
            providesTags: ["Notification"],
        }),
        markAllRead: builder.mutation<{ message: string }, void>({
            query: () => ({ url: "/notifications/read-all", method: "POST" }),
            invalidatesTags: ["Notification"],
        }),
        markOneRead: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/notifications/${id}/read`, method: "POST" }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useGetNotificationsQuery, useGetUnreadCountQuery, useMarkAllReadMutation, useMarkOneReadMutation,
} = notificationApiSlice;