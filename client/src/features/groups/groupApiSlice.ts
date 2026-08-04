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
        getMyGroups: builder.query<Group[], void>({
            query: () => "/groups/mine",
            providesTags: ["Group"],
        }),
        getGroup: builder.query<Group, string>({
            query: (id) => `/groups/${id}`,
            providesTags: (_r, _e, id) => [{ type: "Group", id }],
        }),
        createGroup: builder.mutation<Group, { name: string; description?: string; avatarUrl?: string }>({
            query: (body) => ({ url: "/groups", method: "POST", body }),
            invalidatesTags: ["Group"],
        }),
        requestToJoin: builder.mutation<{ message: string }, string>({
            query: (groupId) => ({ url: `/groups/${groupId}/join`, method: "POST" }),
            invalidatesTags: (_r, _e, groupId) => [{ type: "Group", id: groupId }],
        }),
        getPendingRequests: builder.query<PendingRequest[], string>({
            query: (groupId) => `/groups/${groupId}/requests`,
            providesTags: (_r, _e, groupId) => [{ type: "GroupRequests", id: groupId }],
        }),
        getMembers: builder.query<Member[], string>({
            query: (groupId) => `/groups/${groupId}/members`,
            providesTags: (_r, _e, groupId) => [{ type: "GroupMembers", id: groupId }],
        }),
        approveRequest: builder.mutation<{ message: string }, { groupId: string; userId: string }>({
            query: ({ groupId, userId }) => ({ url: `/groups/${groupId}/requests/${userId}/approve`, method: "POST" }),
            invalidatesTags: (_r, _e, { groupId }) => [
                { type: "GroupRequests", id: groupId },
                { type: "GroupMembers", id: groupId },
                { type: "Group", id: groupId },
            ],
        }),
        rejectRequest: builder.mutation<{ message: string }, { groupId: string; userId: string }>({
            query: ({ groupId, userId }) => ({ url: `/groups/${groupId}/requests/${userId}/reject`, method: "POST" }),
            invalidatesTags: (_r, _e, { groupId }) => [{ type: "GroupRequests", id: groupId }],
        }),
        kickMember: builder.mutation<{ message: string }, { groupId: string; userId: string }>({
            query: ({ groupId, userId }) => ({ url: `/groups/${groupId}/members/${userId}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, { groupId }) => [{ type: "GroupMembers", id: groupId }, { type: "Group", id: groupId }],
        }),
        banMember: builder.mutation<{ message: string }, { groupId: string; userId: string }>({
            query: ({ groupId, userId }) => ({ url: `/groups/${groupId}/members/${userId}/ban`, method: "POST" }),
            invalidatesTags: (_r, _e, { groupId }) => [{ type: "GroupMembers", id: groupId }, { type: "Group", id: groupId }],
        }),
        getGroupPosts: builder.query<Post[], string>({
            query: (groupId) => `/posts/group/${groupId}`,
            providesTags: ["Post"],
        }),
    }),
});

export const {
    useGetMyGroupsQuery, useGetGroupQuery, useCreateGroupMutation, useRequestToJoinMutation,
    useGetPendingRequestsQuery, useGetMembersQuery, useApproveRequestMutation, useRejectRequestMutation,
    useKickMemberMutation, useBanMemberMutation, useGetGroupPostsQuery,
} = groupApiSlice;