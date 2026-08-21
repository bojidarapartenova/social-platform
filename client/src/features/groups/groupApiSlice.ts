import { apiSlice } from "../../app/apiSlice";
import type { Post } from "../posts/postApiSlice";

export interface Group {
    _id: string;
    name: string;
    description: string;
    avatarUrl: string;
    ownerId: string;
    membershipStatus?: "owner" | "approved" | "pending" | "banned" | "none";
    memberCount?: number;
}

export interface MyGroupSummary extends Group {
    isOwner: boolean;
}

export interface PendingRequest {
    _id: string;
    userId: { _id: string; username: string; name?: string; avatarUrl?: string };
}

export interface Member {
    _id: string;
    userId: { _id: string; username: string; name?: string; avatarUrl?: string };
    role: "owner" | "member";
}

export const groupApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyGroups: builder.query<MyGroupSummary[], void>({
            query: () => "/groups/mine",
            providesTags: ["GroupList"],
        }),
        getPendingGroups: builder.query<Group[], void>({
            query: () => "/groups/pending",
            providesTags: ["GroupList"],
        }),
        getSuggestedGroups: builder.query<Group[], void>({
            query: () => "/groups/suggested",
            providesTags: ["GroupList"],
        }),
        getIncomingGroupRequestsCount: builder.query<{ count: number }, void>({
            query: () => "/groups/requests/count",
            providesTags: ["GroupRequests"],
        }),
        getGroup: builder.query<Group, string>({
            query: (id) => `/groups/${id}`,
            providesTags: (_r, _e, id) => [{ type: "Group", id }],
        }),
        createGroup: builder.mutation<Group, { name: string; description?: string; avatarUrl?: string }>({
            query: (body) => ({ url: "/groups", method: "POST", body }),
            invalidatesTags: ["Group"],
        }),
        updateGroup: builder.mutation<Group, { id: string; data: { name?: string; description?: string; avatarUrl?: string } }>({
            query: ({ id, data }) => ({ url: `/groups/${id}`, method: "PUT", body: data }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "Group", id }, "Post"],
        }),
        requestToJoin: builder.mutation<{ message: string }, string>({
            query: (groupId) => ({ url: `/groups/${groupId}/join`, method: "POST" }),
            invalidatesTags: (_r, _e, groupId) => [{ type: "Group", id: groupId }, "Group"],
        }),
        leaveGroup: builder.mutation<{ message: string }, string>({
            query: (groupId) => ({ url: `/groups/${groupId}/leave`, method: "POST" }),
            invalidatesTags: (_r, _e, groupId) => [{ type: "Group", id: groupId }, "Group"],
        }),
        getPendingRequests: builder.query<PendingRequest[], string>({
            query: (groupId) => `/groups/${groupId}/requests`,
            providesTags: (_r, _e, groupId) => [{ type: "GroupRequests", id: groupId }, "GroupRequests"],
        }),
        getMembers: builder.query<Member[], string>({
            query: (groupId) => `/groups/${groupId}/members`,
            providesTags: (_r, _e, groupId) => [{ type: "GroupMembers", id: groupId }],
        }),
        approveRequest: builder.mutation<{ message: string }, { groupId: string; userId: string }>({
            query: ({ groupId, userId }) => ({ url: `/groups/${groupId}/requests/${userId}/approve`, method: "POST" }),
            invalidatesTags: (_r, _e, { groupId }) => [
                { type: "GroupRequests", id: groupId }, "GroupRequests",
                { type: "GroupMembers", id: groupId },
                { type: "Group", id: groupId }, "Notification",
            ],
        }),
        rejectRequest: builder.mutation<{ message: string }, { groupId: string; userId: string }>({
            query: ({ groupId, userId }) => ({ url: `/groups/${groupId}/requests/${userId}/reject`, method: "POST" }),
            invalidatesTags: (_r, _e, { groupId }) => [{ type: "GroupRequests", id: groupId }, "GroupRequests"],
        }),
        kickMember: builder.mutation<{ message: string }, { groupId: string; userId: string }>({
            query: ({ groupId, userId }) => ({ url: `/groups/${groupId}/members/${userId}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, { groupId }) => [{ type: "GroupMembers", id: groupId }, { type: "Group", id: groupId }],
        }),
        getGroupPosts: builder.query<Post[], string>({
            query: (groupId) => `/posts/group/${groupId}`,
            providesTags: ["Post"],
        }),
        deleteGroup: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/groups/${id}`, method: "DELETE" }),
            invalidatesTags: ["GroupList", "Post"],
        }),
    }),
});

export const {
    useGetMyGroupsQuery, useGetPendingGroupsQuery, useGetSuggestedGroupsQuery, useGetIncomingGroupRequestsCountQuery,
    useGetGroupQuery, useCreateGroupMutation, useUpdateGroupMutation, useRequestToJoinMutation, useLeaveGroupMutation,
    useGetPendingRequestsQuery, useGetMembersQuery, useApproveRequestMutation, useRejectRequestMutation,
    useKickMemberMutation, useGetGroupPostsQuery, useDeleteGroupMutation
} = groupApiSlice;